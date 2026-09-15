<?php

namespace App\Modules\Company\Models;

use App\Modules\Media\Models\Media;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * A leadership/team bio (blueprint §26.1 "Leadership" page). No timestamps
 * on this table by design — see schema.sql Module 3.
 */
class TeamMember extends Model
{
    public $timestamps = false;

    protected $guarded = [];

    protected $casts = [
        'is_leadership' => 'boolean',
        'sort_order' => 'integer',
    ];

    /** @param  Builder<static>  $query */
    public function scopePublished(Builder $query): void
    {
        $query->where('status', 'published');
    }

    /** @param  Builder<static>  $query */
    public function scopeLeadership(Builder $query): void
    {
        $query->where('is_leadership', true);
    }

    /** @param  Builder<static>  $query */
    public function scopeOrdered(Builder $query): void
    {
        $query->orderBy('sort_order')->orderBy('id');
    }

    public function photo(): BelongsTo
    {
        return $this->belongsTo(Media::class, 'photo_media_id');
    }
}
