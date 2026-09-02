<?php

namespace App\Http\Controllers\Api\V1;

use App\Support\Http\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Backed by the Resource module (app/Modules/Resource): Controller -> Service -> Repository.
 * Stub: returns the standard envelope so the frontend route map is live
 * before the data layer lands.
 */
class ResourceController extends ApiController
{
    public function index(Request $request): JsonResponse
    {
        return ApiResponse::notImplemented('ResourceService::list() then ResourceControllerResource::collection(); GET /api/v1/resources');
    }

    public function show(string $resource): JsonResponse
    {
        return ApiResponse::notImplemented('ResourceService::findBySlug(resource) then ResourceControllerResource; GET /api/v1/resources/{slug}');
    }
}
