<?php

namespace App\Http\Controllers\Api\V1;

use App\Modules\Region\Http\Resources\LocationPublicResource;
use App\Modules\Region\Services\LocationService;
use App\Support\Http\ApiResponse;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

/**
 * Public list of TeamBees offices. `LocalBusiness` schema is emitted by the
 * frontend from this payload.
 */
class LocationController extends ApiController
{
    public function __construct(private readonly LocationService $locations) {}

    public function index(): JsonResponse
    {
        return ApiResponse::collection(
            $this->locations->listPublished()->map(fn ($location) => (new LocationPublicResource($location))->resolve()),
        );
    }

    public function show(string $location): JsonResponse
    {
        $model = $this->locations->detailBySlug($location)
            ?? throw new NotFoundHttpException("Location [{$location}] not found.");

        return ApiResponse::item(new LocationPublicResource($model));
    }
}
