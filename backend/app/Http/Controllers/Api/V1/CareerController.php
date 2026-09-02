<?php

namespace App\Http\Controllers\Api\V1;

use App\Support\Http\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Backed by the Career module (app/Modules/Career): job_postings + job_applications.
 */
class CareerController extends ApiController
{
    public function index(Request $request): JsonResponse
    {
        return ApiResponse::notImplemented('CareerService::listOpen() filterable by location/employment_type; GET /api/v1/careers');
    }

    public function show(string $career): JsonResponse
    {
        return ApiResponse::notImplemented('CareerService::findBySlug(career) with location + seo; GET /api/v1/careers/{slug}');
    }

    public function apply(Request $request, string $career): JsonResponse
    {
        // TODO: ApplyToJobRequest (validate + resume upload) then CareerService::apply() then queue ATS sync.
        return ApiResponse::accepted(['career' => $career, 'status' => 'stub']);
    }
}
