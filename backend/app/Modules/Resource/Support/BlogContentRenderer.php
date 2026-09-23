<?php

namespace App\Modules\Resource\Support;

use DOMDocument;
use DOMElement;
use DOMNode;
use Illuminate\Support\Str;
use League\CommonMark\Environment\Environment;
use League\CommonMark\Extension\CommonMark\CommonMarkCoreExtension;
use League\CommonMark\Extension\GithubFlavoredMarkdownExtension;
use League\CommonMark\MarkdownConverter;

/**
 * Turns an editor-authored post body into safe, render-ready HTML.
 *
 * Bodies are Markdown (GitHub-flavoured) and may contain inline HTML — older
 * posts are pure HTML. Both go through the same pipeline:
 *
 *   Markdown → HTML → allowlist sanitiser → heading anchors + table of contents
 *
 * The sanitiser is the security boundary: only the tags and attributes listed
 * below survive, dangerous elements are dropped with their content, unknown
 * elements are unwrapped (their text is kept), and every URL must be http(s),
 * mailto, tel or site-relative.
 */
final class BlogContentRenderer
{
    /** Elements removed together with everything inside them. */
    private const DROP = [
        'script', 'style', 'iframe', 'object', 'embed', 'form', 'input', 'button', 'textarea',
        'select', 'option', 'svg', 'math', 'template', 'noscript', 'link', 'meta', 'base',
        'frame', 'frameset', 'applet', 'audio', 'video', 'source', 'canvas', 'dialog',
    ];

    /** Allowed element => allowed attributes. */
    private const ALLOW = [
        'p' => [], 'br' => [], 'hr' => [],
        'h2' => [], 'h3' => [], 'h4' => [], 'h5' => [], 'h6' => [],
        'strong' => [], 'b' => [], 'em' => [], 'i' => [], 'u' => [], 's' => [], 'del' => [],
        'mark' => [], 'sup' => [], 'sub' => [], 'small' => [], 'span' => [],
        'code' => ['class'], 'pre' => [], 'blockquote' => [], 'kbd' => [],
        'ul' => [], 'ol' => ['start'], 'li' => [],
        'a' => ['href', 'title'],
        'img' => ['src', 'alt', 'title', 'width', 'height'],
        'figure' => [], 'figcaption' => [],
        'table' => [], 'thead' => [], 'tbody' => [], 'tr' => [],
        'th' => ['align', 'colspan', 'rowspan'], 'td' => ['align', 'colspan', 'rowspan'],
    ];

    private MarkdownConverter $converter;

    public function __construct()
    {
        $environment = new Environment([
            // Raw HTML is passed through here and cleaned by sanitize() below.
            'html_input' => 'allow',
            'allow_unsafe_links' => false,
            'max_nesting_level' => 50,
        ]);
        $environment->addExtension(new CommonMarkCoreExtension);
        $environment->addExtension(new GithubFlavoredMarkdownExtension);

        $this->converter = new MarkdownConverter($environment);
    }

    /**
     * @return array{html: string, toc: list<array{id: string, text: string, level: int}>}
     */
    public function render(?string $body): array
    {
        $body = trim((string) $body);

        if ($body === '') {
            return ['html' => '', 'toc' => []];
        }

        $html = (string) $this->converter->convert($body);

        return $this->sanitize($html);
    }

    /**
     * @return array{html: string, toc: list<array{id: string, text: string, level: int}>}
     */
    private function sanitize(string $html): array
    {
        $doc = new DOMDocument('1.0', 'UTF-8');
        $previous = libxml_use_internal_errors(true);
        $doc->loadHTML(
            '<?xml encoding="UTF-8"><div id="__blog_root">'.$html.'</div>',
            LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD | LIBXML_NONET,
        );
        libxml_clear_errors();
        libxml_use_internal_errors($previous);

        $root = $doc->getElementById('__blog_root');

        if (! $root instanceof DOMElement) {
            return ['html' => '', 'toc' => []];
        }

        $this->cleanChildren($root);

        $toc = [];
        $usedIds = [];

        foreach (iterator_to_array($root->getElementsByTagName('*')) as $el) {
            /** @var DOMElement $el */
            $tag = strtolower($el->tagName);

            if ($tag === 'h2' || $tag === 'h3') {
                $text = trim(preg_replace('/\s+/u', ' ', $el->textContent) ?? '');
                if ($text === '') {
                    continue;
                }
                $id = $this->uniqueId(Str::slug($text) ?: 'section', $usedIds);
                $el->setAttribute('id', $id);
                $toc[] = ['id' => $id, 'text' => $text, 'level' => (int) substr($tag, 1)];
            }

            if ($tag === 'a' && $el->hasAttribute('href') && preg_match('#^https?://#i', $el->getAttribute('href'))) {
                $el->setAttribute('target', '_blank');
                $el->setAttribute('rel', 'noopener noreferrer nofollow');
            }

            if ($tag === 'img') {
                $el->setAttribute('loading', 'lazy');
                $el->setAttribute('decoding', 'async');
                if (! $el->hasAttribute('alt')) {
                    $el->setAttribute('alt', '');
                }
            }
        }

        $out = '';
        foreach ($root->childNodes as $child) {
            $out .= $doc->saveHTML($child);
        }

        return ['html' => trim($out), 'toc' => $toc];
    }

    private function cleanChildren(DOMNode $parent): void
    {
        foreach (iterator_to_array($parent->childNodes) as $node) {
            if ($node->nodeType === XML_COMMENT_NODE || $node->nodeType === XML_PI_NODE) {
                $parent->removeChild($node);

                continue;
            }

            if (! $node instanceof DOMElement) {
                continue;
            }

            $tag = strtolower($node->tagName);

            if (in_array($tag, self::DROP, true)) {
                $parent->removeChild($node);

                continue;
            }

            // The page title is the only <h1>; demote any in the body.
            if ($tag === 'h1') {
                $node = $this->rename($node, 'h2');
                $tag = 'h2';
            }

            if (! array_key_exists($tag, self::ALLOW)) {
                // Unknown wrapper (div, section, font…): keep its content, drop the tag.
                $this->cleanChildren($node);
                while ($node->firstChild) {
                    $parent->insertBefore($node->firstChild, $node);
                }
                $parent->removeChild($node);

                continue;
            }

            $this->cleanAttributes($node, self::ALLOW[$tag]);

            if ($tag === 'a' && ! $node->hasAttribute('href')) {
                // An anchor without a safe target is just text.
                while ($node->firstChild) {
                    $parent->insertBefore($node->firstChild, $node);
                }
                $parent->removeChild($node);

                continue;
            }

            if ($tag === 'img' && ! $node->hasAttribute('src')) {
                $parent->removeChild($node);

                continue;
            }

            $this->cleanChildren($node);
        }
    }

    /** @param  list<string>  $allowed */
    private function cleanAttributes(DOMElement $el, array $allowed): void
    {
        foreach (iterator_to_array($el->attributes) as $attr) {
            $name = strtolower($attr->name);
            $value = trim($attr->value);

            $keep = in_array($name, $allowed, true) && match ($name) {
                'href' => $this->isSafeUrl($value, allowContact: true),
                'src' => $this->isSafeUrl($value, allowContact: false),
                'class' => (bool) preg_match('/^language-[\w+#-]{1,30}$/', $value),
                'width', 'height', 'colspan', 'rowspan', 'start' => ctype_digit($value) && (int) $value <= 5000,
                'align' => in_array(strtolower($value), ['left', 'center', 'right'], true),
                default => true,
            };

            if (! $keep) {
                $el->removeAttribute($attr->name);
            }
        }
    }

    private function isSafeUrl(string $url, bool $allowContact): bool
    {
        if ($url === '') {
            return false;
        }

        // Strip control characters / whitespace browsers ignore when parsing schemes.
        $normalized = strtolower(preg_replace('/[\x00-\x20]+/', '', $url) ?? '');

        if (str_starts_with($normalized, '//')) {
            return false; // protocol-relative: ambiguous host, disallow
        }

        if (str_starts_with($normalized, '/') || str_starts_with($normalized, '#')) {
            return true;
        }

        $schemes = $allowContact ? ['http:', 'https:', 'mailto:', 'tel:'] : ['http:', 'https:'];

        foreach ($schemes as $scheme) {
            if (str_starts_with($normalized, $scheme)) {
                return true;
            }
        }

        return false;
    }

    private function rename(DOMElement $el, string $tag): DOMElement
    {
        $replacement = $el->ownerDocument->createElement($tag);
        while ($el->firstChild) {
            $replacement->appendChild($el->firstChild);
        }
        $el->parentNode?->replaceChild($replacement, $el);

        return $replacement;
    }

    /** @param  array<string, true>  $used */
    private function uniqueId(string $base, array &$used): string
    {
        $id = $base;
        $n = 2;
        while (isset($used[$id])) {
            $id = "{$base}-{$n}";
            $n++;
        }
        $used[$id] = true;

        return $id;
    }
}
