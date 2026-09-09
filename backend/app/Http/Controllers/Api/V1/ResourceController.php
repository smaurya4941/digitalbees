<?php

namespace App\Http\Controllers\Api\V1;

use App\Modules\Resource\Http\Resources\ResourcePublicResource;
use App\Modules\Resource\Services\ResourceService;
use App\Support\Http\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

/**
 * Public resources feed (blog / guide / webinar / research / news).
 * `?type=` narrows it; `/insights` is the same data pinned to `type=blog`.
 */
class ResourceController extends ApiController
{
    public function __construct(private readonly ResourceService $resources) {}

    public function index(Request $request): JsonResponse
    {
        $paginator = $this->resources->listPublished($request->only('type'), (int) $request->integer('per_page', 12));

        return ApiResponse::page(
            $paginator,
            fn ($resource) => (new ResourcePublicResource($resource))->resolve(),
        );
    }

    public function show(string $resource): JsonResponse
    {
        $model = $this->resources->detailBySlug($resource)
            ?? throw new NotFoundHttpException("Resource [{$resource}] not found.");

        return ApiResponse::item((new ResourcePublicResource($model))->asDetail());
    }
}
