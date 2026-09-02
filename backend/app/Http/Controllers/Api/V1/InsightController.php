<?php

namespace App\Http\Controllers\Api\V1;

use App\Support\Http\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Backed by the Insight module (app/Modules/Insight): Controller -> Service -> Repository.
 * Stub: returns the standard envelope so the frontend route map is live
 * before the data layer lands.
 */
class InsightController extends ApiController
{
    public function index(Request $request): JsonResponse
    {
        return ApiResponse::notImplemented('InsightService::list() then InsightControllerResource::collection(); GET /api/v1/insights');
    }

    public function show(string $insight): JsonResponse
    {
        return ApiResponse::notImplemented('InsightService::findBySlug(insight) then InsightControllerResource; GET /api/v1/insights/{slug}');
    }
}
