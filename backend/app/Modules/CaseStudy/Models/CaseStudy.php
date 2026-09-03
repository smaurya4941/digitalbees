<?php

namespace App\Modules\CaseStudy\Models;

use App\Support\Concerns\IsContentEntity;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * A client success story (schema.sql Module 2). Proof content linked to
 * practices / industries / technologies through the content graph.
 */
class CaseStudy extends Model
{
    use IsContentEntity;
    use SoftDeletes;

    protected $table = 'case_studies';

    protected $guarded = [];

    protected $casts = [
        'metrics' => 'array',
        'published_at' => 'datetime',
    ];

    /** Newest published first. `case_studies` has no `sort_order` column. */
    public function scopeOrdered(Builder $query): void
    {
        $query->orderByDesc('published_at')->orderByDesc('id');
    }
}
