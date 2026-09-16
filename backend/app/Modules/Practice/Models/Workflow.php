<?php

namespace App\Modules\Practice\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * A numbered step in a practice's "How We Work" delivery framework
 * (schema.sql Module 2). Normalized out of `practices.workflow_steps`.
 */
class Workflow extends Model
{
    protected $guarded = [];

    protected $casts = [
        'practice_id' => 'integer',
        'step' => 'integer',
        'sort_order' => 'integer',
    ];

    public function practice(): BelongsTo
    {
        return $this->belongsTo(Practice::class);
    }

    /** @param  Builder<static>  $query */
    public function scopeOrdered(Builder $query): void
    {
        $query->orderBy('step')->orderBy('sort_order')->orderBy('id');
    }
}
