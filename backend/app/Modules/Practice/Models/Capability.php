<?php

namespace App\Modules\Practice\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * A capability card inside a practice's "Key Capabilities" grid
 * (schema.sql Module 2). Normalized out of `practices.key_capabilities`.
 */
class Capability extends Model
{
    protected $guarded = [];

    protected $casts = [
        'practice_id' => 'integer',
        'sort_order' => 'integer',
    ];

    public function practice(): BelongsTo
    {
        return $this->belongsTo(Practice::class);
    }

    /** @param  Builder<static>  $query */
    public function scopeOrdered(Builder $query): void
    {
        $query->orderBy('sort_order')->orderBy('id');
    }
}
