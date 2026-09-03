<?php

namespace App\Modules\Region\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * A physical office / delivery centre inside a {@see Region} (schema.sql Module 2).
 */
class Location extends Model
{
    protected $guarded = [];

    protected $casts = [
        'lat' => 'float',
        'lng' => 'float',
        'region_id' => 'integer',
    ];

    /** @param  Builder<static>  $query */
    public function scopePublished(Builder $query): void
    {
        $query->where('status', 'published');
    }

    public function region(): BelongsTo
    {
        return $this->belongsTo(Region::class);
    }
}
