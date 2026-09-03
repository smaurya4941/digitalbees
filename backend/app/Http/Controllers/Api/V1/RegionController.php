<?php

namespace App\Http\Controllers\Api\V1;

use App\Modules\Region\Http\Resources\RegionDetailResource;
use App\Modules\Region\Http\Resources\RegionSummaryResource;
use App\Modules\Region\Services\RegionService;
use App\Support\Http\ApiResponse;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

/**
 * Read API for the Region taxonomy. Controller -> Service -> Repository.
 */
class RegionController extends ApiController
{
    public function __construct(private readonly RegionService $regions) {}

    /** GET /api/v1/regions */
    public function index(): JsonResponse
    {
        return ApiResponse::collection(
            RegionSummaryResource::collection($this->regions->list()),
        );
    }

    /** GET /api/v1/regions/{region} */
    public function show(string $region): JsonResponse
    {
        $detail = $this->regions->detailBySlug($region);

        if ($detail === null) {
            throw new NotFoundHttpException("Region [{$region}] not found.");
        }

        return ApiResponse::item(new RegionDetailResource($detail));
    }
}
