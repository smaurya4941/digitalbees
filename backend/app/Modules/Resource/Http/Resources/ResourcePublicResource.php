<?php

namespace App\Modules\Resource\Http\Resources;

use App\Modules\Resource\Support\BlogContentRenderer;
use App\Support\Seo\SeoPayload;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Public representation — never leaks drafts or internal columns. Used for
 * both the list (card fields only) and the detail view (`asDetail()`), which
 * adds the sanitised body HTML, its table of contents and related posts.
 *
 * @mixin \App\Modules\Resource\Models\Resource
 */
class ResourcePublicResource extends JsonResource
{
    public bool $detail = false;

    /** @var iterable<\App\Modules\Resource\Models\Resource>|null */
    private ?iterable $related = null;

    public function toArray(Request $request): array
    {
        $type = $this->resource_type instanceof \BackedEnum
            ? $this->resource_type->value
            : $this->resource_type;

        $data = [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'resource_type' => $type,
            'excerpt' => $this->excerpt,
            'reading_time_minutes' => $this->reading_time_minutes,
            'published_at' => $this->published_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
            'href' => $this->resource->publicPath(),
            'cover_image' => $this->cover_image,
            'cover_image_alt' => $this->cover_image_alt,
            'is_featured' => (bool) $this->is_featured,
            'tags' => array_values($this->tags ?? []),
            'category' => $this->relationLoaded('category') && $this->category
                ? (new BlogCategoryPublicResource($this->category))->resolve()
                : null,
            'author' => $this->author_name
                ? array_filter([
                    'name' => $this->author_name,
                    'role' => $this->author_role,
                    'avatar' => $this->author_avatar,
                ], fn ($v) => $v !== null && $v !== '')
                : null,
        ];

        if ($this->detail) {
            $rendered = app(BlogContentRenderer::class)->render($this->body);
            $data['body'] = $rendered['html'] !== '' ? $rendered['html'] : null;
            $data['toc'] = $rendered['toc'];
            $data['related'] = $this->related === null
                ? []
                : collect($this->related)->map(fn ($r) => (new self($r))->resolve())->values()->all();
            $data['seo'] = $this->seoPayload($type);
        }

        return array_filter($data, fn ($v) => $v !== null);
    }

    /** @return array<string, mixed> */
    private function seoPayload(?string $type): array
    {
        $path = $this->resource->publicPath();
        $schemaType = $type === 'blog' ? 'BlogPosting' : 'Article';

        return SeoPayload::for($this->resource, [
            'title' => $this->title,
            'description' => $this->excerpt,
            'path' => $path,
            'image_url' => $this->cover_image,
            'schema_type' => $schemaType,
            'schema' => array_filter([
                '@context' => 'https://schema.org',
                '@type' => $schemaType,
                'headline' => $this->title,
                'description' => $this->excerpt,
                'image' => $this->cover_image,
                'datePublished' => $this->published_at?->toIso8601String(),
                'dateModified' => $this->updated_at?->toIso8601String(),
                'articleSection' => $this->relationLoaded('category') ? $this->category?->name : null,
                'keywords' => $this->tags ? implode(', ', $this->tags) : null,
                'author' => $this->author_name
                    ? ['@type' => 'Person', 'name' => $this->author_name]
                    : ['@type' => 'Organization', 'name' => config('seo.organization_name')],
                'publisher' => ['@type' => 'Organization', 'name' => config('seo.organization_name')],
            ], fn ($v) => $v !== null && $v !== ''),
        ]);
    }

    public function asDetail(): self
    {
        $this->detail = true;

        return $this;
    }

    /** @param  iterable<\App\Modules\Resource\Models\Resource>  $related */
    public function withRelated(iterable $related): self
    {
        $this->related = $related;

        return $this;
    }
}
