<?php

namespace App\Http\Controllers\Api\V1;

use App\Support\Http\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Backed by the Industry module (app/Modules/Industry): Controller -> Service -> Repository.
 * Stub: returns the standard envelope so the frontend route map is live
 * before the data layer lands.
 */
class IndustryController extends ApiController
{
    public function index(Request $request): JsonResponse
    {
        return ApiResponse::notImplemented('IndustryService::list() then IndustryControllerResource::collection(); GET /api/v1/industries');
    }

    public function show(string $industry): JsonResponse
    {
        return ApiResponse::notImplemented('IndustryService::findBySlug(industry) then IndustryControllerResource; GET /api/v1/industries/{slug}');
    }
}
