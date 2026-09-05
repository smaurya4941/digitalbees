<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Api\V1\ApiController;
use App\Modules\Region\Http\Requests\StoreRegionRequest;
use App\Modules\Region\Http\Requests\UpdateRegionRequest;
use App\Modules\Region\Http\Resources\RegionAdminResource;
use App\Modules\Region\Services\RegionService;
use App\Support\Enums\ContentStatus;
use App\Support\Http\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class RegionAdminController extends ApiController
{
    public function __construct(private readonly RegionService $regions) {}

    public function index(): JsonResponse
    {
        return ApiResponse::collection(
            RegionAdminResource::collection($this->regions->listForAdmin()),
            ['statuses' => ContentStatus::values()],
        );
    }

    public function show(string $slug): JsonResponse
    {
        return ApiResponse::item(
            new RegionAdminResource($this->regions->findForAdmin($slug)),
        );
    }

    public function store(StoreRegionRequest $request): JsonResponse
    {
        $data = $request->validated();
        $this->guardPublish($request, $data['status'] ?? null);

        $region = $this->regions->create($data);

        return ApiResponse::item(new RegionAdminResource($region), ['created' => true])
            ->setStatusCode(201);
    }

    public function update(UpdateRegionRequest $request, string $slug): JsonResponse
    {
        $region = $this->regions->findForAdmin($slug);
        $data = $request->validated();

        if (array_key_exists('status', $data)) {
            $this->guardPublish($request, $data['status'], $region->status?->value);
        }

        $region = $this->regions->update($region, $data);

        return ApiResponse::item(new RegionAdminResource($region));
    }

    public function destroy(string $slug): JsonResponse
    {
        $region = $this->regions->findForAdmin($slug);
        $this->regions->delete($region);

        return ApiResponse::item(['deleted' => true, 'slug' => $region->slug]);
    }

    private function guardPublish(Request $request, ?string $next, ?string $current = null): void
    {
        if ($next === null || $next === $current) {
            return;
        }

        $touchesPublished = $next === ContentStatus::Published->value
            || $current === ContentStatus::Published->value;

        if ($touchesPublished && $request->user()?->cannot('content.publish')) {
            abort(403, 'Publishing content requires the content.publish permission.');
        }
    }
}
