<?php

namespace App\Modules\Resource\Models;

use App\Modules\Resource\Enums\ResourceType;
use App\Support\Concerns\Auditable;
use App\Support\Concerns\HasRevisions;
use App\Support\Concerns\HasWorkflow;
use App\Support\Concerns\IsContentEntity;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Laravel\Scout\Searchable;

/**
 * Blog / guide / webinar / research / news article (schema.sql Module 2).
 * `resource_type = blog` is the public "Insights" feed.
 */
class Resource extends Model
{
    use Auditable;
    use HasRevisions;
    use HasWorkflow;
    use IsContentEntity;
    use Searchable;
    use SoftDeletes;

    protected $guarded = [];

    protected $casts = [
        'resource_type' => ResourceType::class,
        'reading_time_minutes' => 'integer',
        'published_at' => 'datetime',
    ];

    public function searchableAs(): string
    {
        return $this->getTable();
    }

    public function shouldBeSearchable(): bool
    {
        return $this->status?->isPublic() ?? false;
    }

    /** @return array<string, mixed> Real columns only — the `database` search engine queries them directly. */
    public function toSearchableArray(): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'excerpt' => $this->excerpt,
        ];
    }

    /** @return array<string, mixed> */
    public function toSearchResult(): array
    {
        // `resource_type = blog` is publicly the Insights collection; every
        // other type stays under Resources — see IsContentEntity's `href`
        // convention mirrored in ResourceDetailResource.
        $isInsight = $this->resource_type === ResourceType::Blog;

        return [
            'type' => $isInsight ? 'insight' : 'resource',
            'title' => $this->title,
            'excerpt' => $this->excerpt,
            'url' => $isInsight ? "/insights/{$this->slug}" : "/resources/{$this->slug}",
        ];
    }
}
