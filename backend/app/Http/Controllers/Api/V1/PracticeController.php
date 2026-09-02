<?php

namespace App\Http\Controllers\Api\V1;

use App\Support\Http\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Backed by the Practice module (app/Modules/Practice).
 */
class PracticeController extends ApiController
{
    public function index(Request $request): JsonResponse
    {
        return ApiResponse::notImplemented('PracticeService::list() then PracticeResource::collection(); GET /api/v1/practices');
    }

    public function show(string $practice): JsonResponse
    {
        return ApiResponse::notImplemented('PracticeService::findBySlug(practice) with subServices, industries, technologies, caseStudies, seo; GET /api/v1/practices/{slug}');
    }

    public function subService(string $practice, string $subService): JsonResponse
    {
        return ApiResponse::notImplemented('SubServiceService::find(practice, subService); GET /api/v1/practices/{slug}/sub-services/{slug}');
    }
}
