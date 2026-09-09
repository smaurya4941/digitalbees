<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Api\V1\Admin\Concerns\GuardsPublishing;
use App\Http\Controllers\Api\V1\Admin\Concerns\RecordsSlugRedirect;
use App\Http\Controllers\Api\V1\ApiController;
use App\Modules\Region\Http\Requests\StoreLocationRequest;
use App\Modules\Region\Http\Requests\UpdateLocationRequest;
use App\Modules\Region\Http\Resources\LocationAdminResource;
use App\Modules\Region\Models\Location;
use App\Modules\Region\Models\Region;
use App\Modules\Region\Services\LocationService;
use App\Support\Enums\ContentStatus;
use App\Support\Http\AdminListQuery;
use App\Support\Http\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Back-office CRUD for physical offices. `content.*` route middleware; moving a
 * location to/from `published` also needs `content.publish`.
 */
class LocationAdminController extends ApiController
{
    use GuardsPublishing;
    use RecordsSlugRedirect;

    public function __construct(private readonly LocationService $locations) {}

    public function index(Request $request): JsonResponse
    {
        $paginator = AdminListQuery::for($request, Location::class, ['name', 'slug', 'city', 'country'], ['updated_at', 'name', 'city'])
            ->when($request->filled('region'), fn ($q) => $q->where('region_id', $request->integer('region')))
            ->with('region:id,name')
            ->paginate(AdminListQuery::perPage($request))
            ->withQueryString();

        return ApiResponse::page(
            $paginator,
            fn (Location $location) => (new LocationAdminResource($location))->resolve(),
            [
                'statuses' => [ContentStatus::Draft->value, ContentStatus::Published->value],
                'regions' => Region::query()->orderBy('name')->get(['id', 'name'])->all(),
            ],
        );
    }

    public function show(string $slug): JsonResponse
    {
        return ApiResponse::item(
            new LocationAdminResource($this->locations->findForAdmin($slug)->load('region')),
        );
    }

    public function store(StoreLocationRequest $request): JsonResponse
    {
        $data = $request->validated();
        $this->guardPublish($request, $data['status'] ?? null);

        return ApiResponse::item(new LocationAdminResource($this->locations->create($data)->load('region')), ['created' => true])
            ->setStatusCode(201);
    }

    public function update(UpdateLocationRequest $request, string $slug): JsonResponse
    {
        $location = $this->locations->findForAdmin($slug);
        $data = $request->validated();

        if (array_key_exists('status', $data)) {
            $this->guardPublish($request, $data['status'], $location->status?->value);
        }

        $location = $this->locations->update($location, $data);
        $this->recordSlugRedirect('/locations', $slug, $location->slug);

        return ApiResponse::item(new LocationAdminResource($location->load('region')));
    }

    public function destroy(string $slug): JsonResponse
    {
        $location = $this->locations->findForAdmin($slug);
        $this->locations->delete($location);

        return ApiResponse::item(['deleted' => true, 'slug' => $location->slug]);
    }
}
