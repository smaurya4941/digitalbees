<?php

namespace App\Modules\Resource\Models;

use App\Modules\Resource\Enums\ResourceType;
use App\Support\Concerns\Auditable;
use App\Support\Concerns\HasRevisions;
use App\Support\Concerns\IsContentEntity;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * Blog / guide / webinar / research / news article (schema.sql Module 2).
 * `resource_type = blog` is the public "Insights" feed.
 */
class Resource extends Model
{
    use Auditable;
    use HasRevisions;
    use IsContentEntity;
    use SoftDeletes;

    protected $guarded = [];

    protected $casts = [
        'resource_type' => ResourceType::class,
        'reading_time_minutes' => 'integer',
        'published_at' => 'datetime',
    ];
}
