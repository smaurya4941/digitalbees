<?php

namespace App\Modules\Testimonial\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

/**
 * A client or employee quote (blueprint §10.1, §10.2 proof-bar pattern).
 * `related_type` is a simple string tag — `home` for the homepage's generic
 * testimonial section, or a morph-map key (`practice`, `case_study`, ...)
 * plus `related_id` when tagged to a specific entity. Deliberately not a
 * real `morphTo()` relation: `home` isn't a model, and nothing here needs to
 * eager-load the tagged entity today — only its category.
 */
class Testimonial extends Model
{
    protected $guarded = [];

    protected $casts = [
        'sort_order' => 'integer',
    ];

    /** @param  Builder<static>  $query */
    public function scopePublished(Builder $query): void
    {
        $query->where('status', 'published');
    }

    /** @param  Builder<static>  $query */
    public function scopeOrdered(Builder $query): void
    {
        $query->orderBy('sort_order')->orderBy('id');
    }

    /** @param  Builder<static>  $query */
    public function scopeFor(Builder $query, string $relatedType): void
    {
        $query->where('related_type', $relatedType);
    }
}
