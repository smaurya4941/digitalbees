<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Api\V1\Admin\Concerns\GuardsPublishing;
use App\Http\Controllers\Api\V1\Admin\Concerns\RecordsSlugRedirect;
use App\Http\Controllers\Api\V1\ApiController;
use App\Modules\Region\Http\Requests\StoreRegionRequest;
use App\Modules\Region\Http\Requests\UpdateRegionRequest;
use App\Modules\Region\Http\Resources\RegionAdminResource;
use App\Modules\Region\Models\Region;
use App\Modules\Region\Services\RegionService;
use App\Support\Enums\ContentStatus;
use App\Support\Http\AdminListQuery;
use App\Support\Http\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class RegionAdminController extends ApiController
{
    use GuardsPublishing;
    use RecordsSlugRedirect;

    public function __construct(private readonly RegionService $regions) {}

    public function index(Request $request): JsonResponse
    {
        $paginator = AdminListQuery::for($request, Region::class, ['name', 'slug', 'iso_code'], ['updated_at', 'name', 'sort_order'])
            ->paginate(AdminListQuery::perPage($request))
            ->withQueryString();

        return ApiResponse::page(
            $paginator,
            fn (Region $region) => (new RegionAdminResource($region))->resolve(),
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
        $this->recordSlugRedirect('/regions', $slug, $region->slug);

        return ApiResponse::item(new RegionAdminResource($region));
    }

    public function destroy(string $slug): JsonResponse
    {
        $region = $this->regions->findForAdmin($slug);
        $this->regions->delete($region);

        return ApiResponse::item(['deleted' => true, 'slug' => $region->slug]);
    }
}
