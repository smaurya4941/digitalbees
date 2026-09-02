<?php

namespace App\Support\Seo;

use App\Support\Models\SeoMetadata;
use Illuminate\Database\Eloquent\Model;

/**
 * Builds the SEO block the frontend's generateMetadata() consumes. Prefers an
 * editor-authored `seo_metadata` row; otherwise synthesises sane defaults from
 * the entity so every page is indexable from day one.
 *
 * Output shape matches frontend `types/seo.ts` (SeoBlock).
 */
final class SeoPayload
{
    /**
     * @param  array{
     *     title?: string,
     *     description?: string|null,
     *     path: string,
     *     schema_type?: string,
     *     schema?: array<string, mixed>|null,
     *     image_url?: string|null,
     * }  $defaults
     * @return array<string, mixed>
     */
    public static function for(Model $entity, array $defaults): array
    {
        /** @var SeoMetadata|null $row */
        $row = $entity->relationLoaded('seo') ? $entity->getRelation('seo') : $entity->seo()->first();

        $siteUrl = rtrim((string) (config('frontend.urls')[0] ?? config('app.url')), '/');
        $canonical = $siteUrl.'/'.ltrim($defaults['path'], '/');

        $title = $row?->meta_title
            ?? ($defaults['title'] ?? '').config('seo.title_suffix', ' | TeamBees');
        $description = $row?->meta_description ?? ($defaults['description'] ?? null);

        return [
            'meta_title' => $title,
            'meta_description' => $description,
            'canonical_url' => $row?->canonical_url ?? $canonical,
            'robots' => $row?->robots ?? config('seo.default_robots', 'index,follow'),
            'og_title' => $row?->og_title ?? $title,
            'og_description' => $row?->og_description ?? $description,
            'og_image_url' => $row?->og_image_id ? null : ($defaults['image_url'] ?? null),
            'twitter_card' => $row?->twitter_card ?? 'summary_large_image',
            'schema_type' => $row?->schema_type ?? ($defaults['schema_type'] ?? null),
            'schema_json' => $row?->schema_json ?? ($defaults['schema'] ?? null),
        ];
    }
}
