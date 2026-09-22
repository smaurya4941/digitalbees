<?php

namespace App\Modules\Career\Services;

use Illuminate\Http\UploadedFile;
use Smalot\PdfParser\Parser as PdfParser;
use Throwable;
use ZipArchive;

/**
 * Best-effort extraction of contact details from an uploaded resume so the
 * application form can be pre-filled (blueprint §28.2: "resume-parse-to-prefill
 * … never require re-typing data already in the uploaded resume").
 *
 * The file is read from PHP's upload temp path and never persisted here —
 * only the real submission (CareerService::apply) stores a resume. Parsing is
 * strictly advisory: any failure (corrupt file, legacy .doc, scanned PDF with
 * no text layer) yields an empty result and the candidate simply types the
 * fields themselves.
 */
final class ResumeParser
{
    /** Only the head of a resume carries the header/contact block. */
    private const MAX_TEXT_CHARS = 6000;

    /** Guards against decompression bombs in .docx (zip) uploads. */
    private const MAX_DOCX_XML_BYTES = 5 * 1024 * 1024;

    /** @return array{full_name?: string, email?: string, phone?: string} */
    public function parse(UploadedFile $file): array
    {
        try {
            $text = match (strtolower($file->getClientOriginalExtension())) {
                'pdf' => $this->pdfText($file->getRealPath()),
                'docx' => $this->docxText($file->getRealPath()),
                default => '', // legacy binary .doc has no reliable pure-PHP reader
            };
        } catch (Throwable) {
            return [];
        }

        return $this->extract($text);
    }

    /** @return array{full_name?: string, email?: string, phone?: string} */
    public function extract(string $text): array
    {
        $text = mb_substr(trim($text), 0, self::MAX_TEXT_CHARS);
        if ($text === '') {
            return [];
        }

        $result = [];

        if (preg_match('/[A-Z0-9._%+\-]+@[A-Z0-9.\-]+\.[A-Z]{2,}/i', $text, $m)) {
            $result['email'] = strtolower($m[0]);
        }

        if ($phone = $this->findPhone($text)) {
            $result['phone'] = $phone;
        }

        if ($name = $this->findName($text)) {
            $result['full_name'] = $name;
        }

        return $result;
    }

    private function findPhone(string $text): ?string
    {
        // +CC and separators optional; 8–15 digits overall (E.164 upper bound).
        if (! preg_match_all('/(?<![\d])(\+?\(?\d[\d\s().\-]{7,20}\d)(?![\d])/', $text, $matches)) {
            return null;
        }

        foreach ($matches[1] as $candidate) {
            $digits = preg_replace('/\D/', '', $candidate);
            $length = strlen((string) $digits);

            // Skip year ranges ("2019 - 2023"), ids and long numeric runs.
            if ($length < 8 || $length > 15 || preg_match('/^(19|20)\d{2}\D+(19|20)\d{2}$/', trim($candidate))) {
                continue;
            }

            return trim(preg_replace('/\s+/', ' ', $candidate));
        }

        return null;
    }

    private function findName(string $text): ?string
    {
        $lines = preg_split('/\R/u', $text) ?: [];

        foreach (array_slice($lines, 0, 12) as $line) {
            $line = trim(preg_replace('/\s+/u', ' ', $line));

            if ($line === '' || preg_match('/[\d@:\/]/', $line)) {
                continue;
            }

            // 2–4 alphabetic words, each capitalised or ALL-CAPS ("JANE DOE").
            if (! preg_match('/^(\p{Lu}[\p{L}\'’.\-]+)(\s\p{Lu}[\p{L}\'’.\-]+){1,3}$/u', $line)) {
                continue;
            }

            if (preg_match('/\b(resume|curriculum|vitae|profile|summary|objective|experience|education|skills|engineer|developer|manager|consultant|analyst)\b/i', $line)) {
                continue;
            }

            return mb_convert_case(mb_strtolower($line), MB_CASE_TITLE);
        }

        return null;
    }

    private function pdfText(string $path): string
    {
        $pdf = (new PdfParser)->parseFile($path);
        $pages = $pdf->getPages();

        // The header lives on page one; skip the rest of a long CV.
        return isset($pages[0]) ? $pages[0]->getText() : $pdf->getText();
    }

    private function docxText(string $path): string
    {
        $zip = new ZipArchive;
        if ($zip->open($path) !== true) {
            return '';
        }

        try {
            $stat = $zip->statName('word/document.xml');
            if ($stat === false || $stat['size'] > self::MAX_DOCX_XML_BYTES) {
                return '';
            }

            $xml = $zip->getFromName('word/document.xml');
        } finally {
            $zip->close();
        }

        if (! is_string($xml)) {
            return '';
        }

        // Paragraph and line breaks become newlines so line-based name detection works.
        $xml = preg_replace('/<\/w:p>|<w:br\s*\/?>/i', "\n", $xml) ?? $xml;

        return html_entity_decode(strip_tags($xml), ENT_QUOTES | ENT_XML1, 'UTF-8');
    }
}
