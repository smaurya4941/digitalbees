<?php

namespace App\Modules\Region\Models;

use App\Support\Concerns\IsContentEntity;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * A geography TeamBees operates in (schema.sql Module 2). Fixed set of six.
 */
class Region extends Model
{
    use IsContentEntity;

    protected $guarded = [];

    protected $casts = [
        'sort_order' => 'integer',
    ];

    public function locations(): HasMany
    {
        return $this->hasMany(Location::class);
    }
}
