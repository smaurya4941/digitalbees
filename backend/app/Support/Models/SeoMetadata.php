<?php

namespace App\Support\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;

/**
 * Polymorphic SEO block (schema.sql Module 7). One row per content entity;
 * the single source the frontend's generateMetadata() reads.
 */
class SeoMetadata extends Model
{
    protected $table = 'seo_metadata';

    protected $guarded = [];

    protected $casts = [
        'schema_json' => 'array',
    ];

    public function seoable(): MorphTo
    {
        return $this->morphTo();
    }
}
