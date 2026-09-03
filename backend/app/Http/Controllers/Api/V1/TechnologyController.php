<?php

namespace App\Http\Controllers\Api\V1;

use App\Modules\Technology\Http\Resources\TechnologyDetailResource;
use App\Modules\Technology\Http\Resources\TechnologySummaryResource;
use App\Modules\Technology\Services\TechnologyService;
use App\Support\Http\ApiResponse;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

/**
 * Read API for the Technology taxonomy. Controller -> Service -> Repository.
 */
class TechnologyController extends ApiController
{
    public function __construct(private readonly TechnologyService $technologies) {}

    /** GET /api/v1/technologies */
    public function index(): JsonResponse
    {
        return ApiResponse::collection(
            TechnologySummaryResource::collection($this->technologies->list()),
        );
    }

    /** GET /api/v1/technologies/{technology} */
    public function show(string $technology): JsonResponse
    {
        $detail = $this->technologies->detailBySlug($technology);

        if ($detail === null) {
            throw new NotFoundHttpException("Technology [{$technology}] not found.");
        }

        return ApiResponse::item(new TechnologyDetailResource($detail));
    }
}
