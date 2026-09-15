<?php

namespace App\Modules\Company\Models;

use App\Modules\Media\Models\Media;
use App\Modules\Technology\Models\Technology;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * A technology/alliance/certification partner (blueprint §26.1
 * "Partnerships & Certifications" page, §10.1 trust signal). No timestamps
 * on this table by design — see schema.sql Module 3.
 */
class Partner extends Model
{
    public $timestamps = false;

    protected $guarded = [];

    protected $casts = [
        'sort_order' => 'integer',
    ];

    /** @param  Builder<static>  $query */
    public function scopePublished(Builder $query): void
    {
        $query->where('status', 'published');
    }

    /** @param  Builder<static>  $query */
    public function scopeOrdered(Builder $query): void
    {
        $query->orderBy('sort_order')->orderBy('id');
    }

    public function logo(): BelongsTo
    {
        return $this->belongsTo(Media::class, 'logo_media_id');
    }

    public function technology(): BelongsTo
    {
        return $this->belongsTo(Technology::class);
    }
}
