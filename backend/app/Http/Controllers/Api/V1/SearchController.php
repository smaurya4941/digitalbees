<?php

namespace App\Http\Controllers\Api\V1;

use App\Support\Http\ApiResponse;
use App\Support\Search\SearchService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Global search (blueprint §30): queries every Scout-searchable model
 * (practices, industries, regions, technologies, case studies, resources —
 * which covers insights too, careers) via {@see SearchService} and returns
 * results grouped by `type` for the `/search` page and the header search
 * overlay. Meilisearch in production, the zero-infra `database` engine
 * everywhere else (config/scout.php).
 */
class SearchController extends ApiController
{
    public function __construct(private readonly SearchService $search) {}

    public function index(Request $request): JsonResponse
    {
        $request->validate([
            'q' => ['required', 'string', 'min:2', 'max:255'],
            'type' => ['nullable', 'string'],
        ]);

        $result = $this->search->search(
            $request->string('q')->toString(),
            $request->filled('type') ? $request->string('type')->toString() : null,
        );

        return ApiResponse::collection($result['results'], ['count' => $result['count']]);
    }
}
