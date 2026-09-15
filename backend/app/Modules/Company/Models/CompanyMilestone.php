<?php

namespace App\Modules\Company\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

/**
 * A year/title/description entry in the "Our Story" timeline (blueprint
 * §26.1). No `status` column — every milestone is always shown; there is no
 * draft state for company history. No timestamps by design.
 */
class CompanyMilestone extends Model
{
    public $timestamps = false;

    protected $guarded = [];

    protected $casts = [
        'year' => 'integer',
        'sort_order' => 'integer',
    ];

    /** @param  Builder<static>  $query */
    public function scopeOrdered(Builder $query): void
    {
        $query->orderBy('sort_order')->orderBy('year');
    }
}
