<?php

namespace App\Support\Search;

use App\Modules\CaseStudy\Models\CaseStudy;
use App\Modules\Career\Models\JobPosting;
use App\Modules\Industry\Models\Industry;
use App\Modules\Practice\Models\Practice;
use App\Modules\Region\Models\Region;
use App\Modules\Resource\Models\Resource;
use App\Modules\Technology\Models\Technology;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

/**
 * Global search (blueprint §30): queries every searchable model through
 * Scout — Meilisearch in production, the zero-infra `database` engine
 * everywhere else (config/scout.php) — and returns results grouped by type.
 * Logs every query to `search_queries` for the zero-results-rate metric.
 */
class SearchService
{
    /** @var array<string, class-string> */
    private const MODELS = [
        'practice' => Practice::class,
        'industry' => Industry::class,
        'region' => Region::class,
        'technology' => Technology::class,
        'case_study' => CaseStudy::class,
        // Resource covers both `insight` and `resource` result types — see
        // Resource::toSearchableArray().
        'resource' => Resource::class,
        'career' => JobPosting::class,
    ];

    /**
     * @return array{results: array<int, array<string, mixed>>, count: int}
     */
    public function search(string $query, ?string $type = null, int $perPage = 10): array
    {
        $models = $type !== null && isset(self::MODELS[$type])
            ? [$type => self::MODELS[$type]]
            : self::MODELS;

        $results = collect($models)
            ->flatMap(fn (string $class) => $class::search($query)->take($perPage)->get())
            ->map(fn ($model) => $model->toSearchResult())
            ->values();

        $this->logQuery($query, $results->count());

        return [
            'results' => $results->all(),
            'count' => $results->count(),
        ];
    }

    private function logQuery(string $query, int $resultsCount): void
    {
        DB::table('search_queries')->insert([
            'query' => $query,
            'results_count' => $resultsCount,
            'user_ip' => request()?->ip(),
            'created_at' => now(),
        ]);
    }
}
