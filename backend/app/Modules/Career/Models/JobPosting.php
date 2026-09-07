<?php

namespace App\Modules\Career\Models;

use App\Modules\Career\Enums\JobStatus;
use App\Modules\Region\Models\Location;
use App\Support\Concerns\Auditable;
use App\Support\Models\SeoMetadata;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphOne;

/**
 * An open role (schema.sql Module 2, `job_postings`). Public while `status =
 * open`. `JobPosting` schema-dot-org markup is emitted by the frontend.
 */
class JobPosting extends Model
{
    use Auditable;

    protected $table = 'job_postings';

    protected $guarded = [];

    protected $casts = [
        'status' => JobStatus::class,
        'posted_at' => 'datetime',
        'closes_at' => 'datetime',
    ];

    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    /** @param  Builder<static>  $query */
    public function scopeOpen(Builder $query): void
    {
        $query->where('status', JobStatus::Open->value);
    }

    public function location(): BelongsTo
    {
        return $this->belongsTo(Location::class, 'location_id');
    }

    public function applications(): HasMany
    {
        return $this->hasMany(JobApplication::class, 'job_id');
    }

    public function seo(): MorphOne
    {
        return $this->morphOne(SeoMetadata::class, 'seoable');
    }
}
