<?php

namespace App\Modules\Career\Models;

use App\Modules\Career\Enums\JobStatus;
use App\Modules\Region\Models\Location;
use App\Support\Concerns\Auditable;
use App\Support\Concerns\HasRevisions;
use App\Support\Concerns\HasWorkflow;
use App\Support\Models\SeoMetadata;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphOne;
use Laravel\Scout\Searchable;

/**
 * An open role (schema.sql Module 2, `job_postings`). Public while `status =
 * open`. `JobPosting` schema-dot-org markup is emitted by the frontend.
 */
class JobPosting extends Model
{
    use Auditable;
    use HasRevisions;
    use HasWorkflow;
    use Searchable;

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

    public function searchableAs(): string
    {
        return $this->getTable();
    }

    /** Only open roles are searchable — a closed posting is not a live page. */
    public function shouldBeSearchable(): bool
    {
        return $this->status === JobStatus::Open;
    }

    /** @return array<string, mixed> Real columns only — the `database` search engine queries them directly. */
    public function toSearchableArray(): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
        ];
    }

    /** @return array<string, mixed> */
    public function toSearchResult(): array
    {
        return [
            'type' => 'career',
            'title' => $this->title,
            'excerpt' => $this->location?->name,
            'url' => "/careers/{$this->slug}",
        ];
    }
}
