<?php

namespace App\Http\Controllers\Api\V1;

use App\Support\Http\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Backed by the Location module (app/Modules/Location): Controller -> Service -> Repository.
 * Stub: returns the standard envelope so the frontend route map is live
 * before the data layer lands.
 */
class LocationController extends ApiController
{
    public function index(Request $request): JsonResponse
    {
        return ApiResponse::notImplemented('LocationService::list() then LocationControllerResource::collection(); GET /api/v1/locations');
    }

    public function show(string $location): JsonResponse
    {
        return ApiResponse::notImplemented('LocationService::findBySlug(location) then LocationControllerResource; GET /api/v1/locations/{slug}');
    }
}
