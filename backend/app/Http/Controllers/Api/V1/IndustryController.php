<?php

namespace App\Http\Controllers\Api\V1;

use App\Modules\Industry\Http\Resources\IndustryDetailResource;
use App\Modules\Industry\Http\Resources\IndustrySummaryResource;
use App\Modules\Industry\Services\IndustryService;
use App\Support\Http\ApiResponse;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

/**
 * Read API for the Industry taxonomy. Controller -> Service -> Repository.
 */
class IndustryController extends ApiController
{
    public function __construct(private readonly IndustryService $industries) {}

    /** GET /api/v1/industries */
    public function index(): JsonResponse
    {
        return ApiResponse::collection(
            IndustrySummaryResource::collection($this->industries->list()),
        );
    }

    /** GET /api/v1/industries/{industry} */
    public function show(string $industry): JsonResponse
    {
        $detail = $this->industries->detailBySlug($industry);

        if ($detail === null) {
            throw new NotFoundHttpException("Industry [{$industry}] not found.");
        }

        return ApiResponse::item(new IndustryDetailResource($detail));
    }
}
