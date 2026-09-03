<?php

namespace App\Http\Controllers\Api\V1;

use App\Modules\CaseStudy\Http\Resources\CaseStudyDetailResource;
use App\Modules\CaseStudy\Http\Resources\CaseStudySummaryResource;
use App\Modules\CaseStudy\Services\CaseStudyService;
use App\Support\Http\ApiResponse;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

/**
 * Read API for case studies. Controller -> Service -> Repository.
 */
class CaseStudyController extends ApiController
{
    public function __construct(private readonly CaseStudyService $caseStudies) {}

    /** GET /api/v1/case-studies */
    public function index(): JsonResponse
    {
        return ApiResponse::collection(
            CaseStudySummaryResource::collection($this->caseStudies->list()),
        );
    }

    /** GET /api/v1/case-studies/{caseStudy} */
    public function show(string $caseStudy): JsonResponse
    {
        $detail = $this->caseStudies->detailBySlug($caseStudy);

        if ($detail === null) {
            throw new NotFoundHttpException("Case study [{$caseStudy}] not found.");
        }

        return ApiResponse::item(new CaseStudyDetailResource($detail));
    }
}
