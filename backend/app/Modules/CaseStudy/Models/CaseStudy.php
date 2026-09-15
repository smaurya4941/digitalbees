<?php

namespace App\Modules\CaseStudy\Models;

use App\Support\Concerns\Auditable;
use App\Support\Concerns\HasRevisions;
use App\Support\Concerns\HasWorkflow;
use App\Support\Concerns\IsContentEntity;
use App\Support\Search\SearchableContentEntity;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * A client success story (schema.sql Module 2). Proof content linked to
 * practices / industries / technologies through the content graph.
 */
class CaseStudy extends Model
{
    use Auditable;
    use HasRevisions;
    use HasWorkflow;
    use IsContentEntity;
    use SearchableContentEntity;
    use SoftDeletes;

    protected $table = 'case_studies';

    protected $guarded = [];

    protected $casts = [
        'metrics' => 'array',
        'how_it_works' => 'array',
        'capabilities_used' => 'array',
        'published_at' => 'datetime',
    ];

    /** Newest published first. `case_studies` has no `sort_order` column. */
    public function scopeOrdered(Builder $query): void
    {
        $query->orderByDesc('published_at')->orderByDesc('id');
    }

    /** No `name` column — real columns for the database search engine are `title`/`summary`. */
    public function toSearchableArray(): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'summary' => $this->summary,
        ];
    }

    public function toSearchResult(): array
    {
        return [
            'type' => 'case_study',
            'title' => $this->title,
            'excerpt' => $this->summary,
            'url' => "/case-studies/{$this->slug}",
        ];
    }

    protected function searchResultType(): string
    {
        return 'case_study';
    }

    protected function searchResultUrl(): string
    {
        return "/case-studies/{$this->slug}";
    }
}
