<?php

namespace App\Http\Controllers\Api\V1;

use App\Modules\Practice\Http\Resources\PracticeDetailResource;
use App\Modules\Practice\Http\Resources\PracticeSummaryResource;
use App\Modules\Practice\Http\Resources\SubServiceResource;
use App\Modules\Practice\Services\PracticeService;
use App\Support\Http\ApiResponse;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

/**
 * Read API for the Practice taxonomy. Thin: delegates to {@see PracticeService}
 * and shapes output with the module resources + {@see ApiResponse}.
 */
class PracticeController extends ApiController
{
    public function __construct(private readonly PracticeService $practices) {}

    /** GET /api/v1/practices */
    public function index(): JsonResponse
    {
        return ApiResponse::collection(
            PracticeSummaryResource::collection($this->practices->list()),
        );
    }

    /** GET /api/v1/practices/{practice} */
    public function show(string $practice): JsonResponse
    {
        $detail = $this->practices->detailBySlug($practice);

        if ($detail === null) {
            throw new NotFoundHttpException("Practice [{$practice}] not found.");
        }

        return ApiResponse::item(new PracticeDetailResource($detail));
    }

    /** GET /api/v1/practices/{practice}/sub-services/{subService} */
    public function subService(string $practice, string $subService): JsonResponse
    {
        $model = $this->practices->subService($practice, $subService);

        if ($model === null) {
            throw new NotFoundHttpException("Sub-service [{$practice}/{$subService}] not found.");
        }

        return ApiResponse::item(new SubServiceResource($model));
    }
}
