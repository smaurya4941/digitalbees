<?php

namespace App\Http\Controllers\Api\V1;

use App\Support\Http\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Backed by the Search integration (app/Integrations/Search): a Meilisearch or
 * Algolia adapter behind a contract.
 * Logs the query to search_queries, returns grouped hits (practices, industries,
 * case studies, resources, ...) for the /search page and the header search.
 */
class SearchController extends ApiController
{
    public function index(Request $request): JsonResponse
    {
        $request->validate([
            'q' => ['required', 'string', 'min:2', 'max:255'],
            'type' => ['nullable', 'string'],
        ]);

        return ApiResponse::notImplemented("SearchService::query('{$request->string('q')}'); GET /api/v1/search?q=");
    }
}
