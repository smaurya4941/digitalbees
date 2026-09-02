<?php

namespace App\Http\Controllers\Api\V1;

use App\Support\Http\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Backed by the CaseStudy module (app/Modules/CaseStudy): Controller -> Service -> Repository.
 * Stub: returns the standard envelope so the frontend route map is live
 * before the data layer lands.
 */
class CaseStudyController extends ApiController
{
    public function index(Request $request): JsonResponse
    {
        return ApiResponse::notImplemented('CaseStudyService::list() then CaseStudyControllerResource::collection(); GET /api/v1/case-studies');
    }

    public function show(string $caseStudy): JsonResponse
    {
        return ApiResponse::notImplemented('CaseStudyService::findBySlug(caseStudy) then CaseStudyControllerResource; GET /api/v1/case-studies/{slug}');
    }
}
