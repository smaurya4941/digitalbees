<?php

namespace App\Http\Controllers\Api\V1;

use App\Support\Http\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Backed by the Region module (app/Modules/Region): Controller -> Service -> Repository.
 * Stub: returns the standard envelope so the frontend route map is live
 * before the data layer lands.
 */
class RegionController extends ApiController
{
    public function index(Request $request): JsonResponse
    {
        return ApiResponse::notImplemented('RegionService::list() then RegionControllerResource::collection(); GET /api/v1/regions');
    }

    public function show(string $region): JsonResponse
    {
        return ApiResponse::notImplemented('RegionService::findBySlug(region) then RegionControllerResource; GET /api/v1/regions/{slug}');
    }
}
