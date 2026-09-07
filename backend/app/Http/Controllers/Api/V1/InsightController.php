<?php

namespace App\Http\Controllers\Api\V1;

use App\Modules\Resource\Enums\ResourceType;
use App\Modules\Resource\Http\Resources\ResourcePublicResource;
use App\Modules\Resource\Services\ResourceService;
use App\Support\Http\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

/**
 * "Insights" is the public label for resources of type `blog`. Same data layer
 * as {@see ResourceController}, pinned to that type.
 */
class InsightController extends ApiController
{
    public function __construct(private readonly ResourceService $resources) {}

    public function index(Request $request): JsonResponse
    {
        $paginator = $this->resources->listPublished(
            ['type' => ResourceType::Blog->value],
            (int) $request->integer('per_page', 12),
        );

        return ApiResponse::page(
            $paginator,
            fn ($resource) => (new ResourcePublicResource($resource))->resolve(),
        );
    }

    public function show(string $insight): JsonResponse
    {
        $model = $this->resources->detailBySlug($insight);

        if ($model === null || $model->resource_type !== ResourceType::Blog) {
            throw new NotFoundHttpException("Insight [{$insight}] not found.");
        }

        return ApiResponse::item((new ResourcePublicResource($model))->asDetail());
    }
}
