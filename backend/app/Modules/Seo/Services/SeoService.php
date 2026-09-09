<?php

namespace App\Modules\Seo\Services;

use App\Support\Models\SeoMetadata;
use Illuminate\Database\Eloquent\Model;

/**
 * Reads and writes the polymorphic seo_metadata block for a content entity.
 */
final class SeoService
{
    private const FIELDS = [
        'meta_title', 'meta_description', 'canonical_url', 'robots',
        'og_title', 'og_description', 'og_image_id',
    ];

    /** @return array<string, mixed>|null */
    public function present(?SeoMetadata $seo): ?array
    {
        if ($seo === null) {
            return null;
        }

        return collect(self::FIELDS)->mapWithKeys(fn (string $f) => [$f => $seo->{$f}])->all();
    }

    /** @param  array<string, mixed>  $data */
    public function sync(Model $model, array $data): SeoMetadata
    {
        $attributes = collect(self::FIELDS)
            ->filter(fn (string $f) => array_key_exists($f, $data))
            ->mapWithKeys(fn (string $f) => [$f => $data[$f]])
            ->all();

        $attributes['robots'] ??= 'index,follow';

        /** @var SeoMetadata */
        return $model->seo()->updateOrCreate([], $attributes);
    }
}
