<?php

namespace App\Modules\Region\Models;

use App\Support\Concerns\Auditable;
use App\Support\Concerns\IsContentEntity;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * A physical office / delivery centre inside a {@see Region} (schema.sql
 * Module 2). `slug` is the public route key; `status` is `draft` / `published`.
 */
class Location extends Model
{
    use Auditable;
    use IsContentEntity;

    protected $guarded = [];

    protected $casts = [
        'lat' => 'float',
        'lng' => 'float',
        'region_id' => 'integer',
    ];

    public function region(): BelongsTo
    {
        return $this->belongsTo(Region::class);
    }
}
