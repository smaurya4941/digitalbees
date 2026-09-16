<?php

namespace App\Modules\Faq\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;

/**
 * A question/answer pair attached to a practice or sub-service
 * (schema.sql Module 6, `faqable_type`/`faqable_id`).
 */
class Faq extends Model
{
    protected $guarded = [];

    protected $casts = [
        'faqable_id' => 'integer',
        'sort_order' => 'integer',
    ];

    public function faqable(): MorphTo
    {
        return $this->morphTo();
    }

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
    public function scopeFor(Builder $query, string $faqableType, int $faqableId): void
    {
        $query->where('faqable_type', $faqableType)->where('faqable_id', $faqableId);
    }
}
