<?php

namespace App\Modules\Practice\Models;

use App\Support\Concerns\Auditable;
use App\Support\Concerns\HasRevisions;
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
    use Auditable;
    use HasRevisions;
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
