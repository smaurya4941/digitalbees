<?php

namespace App\Http\Controllers\Api\V1;

use App\Support\Http\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Backed by the Technology module (app/Modules/Technology): Controller -> Service -> Repository.
 * Stub: returns the standard envelope so the frontend route map is live
 * before the data layer lands.
 */
class TechnologyController extends ApiController
{
    public function index(Request $request): JsonResponse
    {
        return ApiResponse::notImplemented('TechnologyService::list() then TechnologyControllerResource::collection(); GET /api/v1/technologies');
    }

    public function show(string $technology): JsonResponse
    {
        return ApiResponse::notImplemented('TechnologyService::findBySlug(technology) then TechnologyControllerResource; GET /api/v1/technologies/{slug}');
    }
}
