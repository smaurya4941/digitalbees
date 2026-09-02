<?php

namespace App\Modules\Practice\Models;

use App\Support\Concerns\IsContentEntity;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * One of the seven TeamBees practices (schema.sql Module 2).
 * Route key: {@see IsContentEntity} — `slug`.
 */
class Practice extends Model
{
    use IsContentEntity;
    use SoftDeletes;

    protected $guarded = [];

    protected $casts = [
        'sort_order' => 'integer',
    ];

    public function subServices(): HasMany
    {
        return $this->hasMany(SubService::class);
    }
}
