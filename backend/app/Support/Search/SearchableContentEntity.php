<?php

namespace App\Support\Search;

use Laravel\Scout\Searchable;

/**
 * Shared Scout wiring for the five taxonomy/content models that already use
 * {@see \App\Support\Concerns\IsContentEntity} (Practice, Industry, Region,
 * Technology, CaseStudy): a stable per-model index name and "published only"
 * visibility.
 *
 * `toSearchableArray()` must return real, queryable database columns — the
 * `database` Scout engine (config/scout.php's zero-infra default) builds its
 * `WHERE ... LIKE` query directly from `array_keys(toSearchableArray())`, so
 * a display-only key like `url` or `type` here would try to query a column
 * that doesn't exist and crash the search. Display shaping for the API
 * response happens separately, in {@see toSearchResult()}, which
 * {@see SearchService} calls on the Eloquent models Scout returns — never on
 * the raw index array.
 *
 * `CaseStudy` doesn't have a `name` field (it's `title`), so it overrides
 * both methods rather than this trait assuming a column that doesn't exist
 * everywhere.
 */
trait SearchableContentEntity
{
    use Searchable;

    public function searchableAs(): string
    {
        return $this->getTable();
    }

    /** Never index draft/archived rows — this mirrors the `published()` scope's own predicate. */
    public function shouldBeSearchable(): bool
    {
        return $this->status?->isPublic() ?? false;
    }

    /** @return array<string, mixed> Real columns only — see the class docblock. */
    public function toSearchableArray(): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'summary' => $this->summary,
        ];
    }

    /** The shape {@see SearchService} groups into the `/search` response. */
    public function toSearchResult(): array
    {
        return [
            'type' => $this->searchResultType(),
            'title' => (string) $this->name,
            'excerpt' => $this->summary,
            'url' => $this->searchResultUrl(),
        ];
    }

    abstract protected function searchResultType(): string;

    abstract protected function searchResultUrl(): string;
}
