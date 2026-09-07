<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Api\V1\Admin\Concerns\GuardsPublishing;
use App\Http\Controllers\Api\V1\Admin\Concerns\RecordsSlugRedirect;
use App\Http\Controllers\Api\V1\ApiController;
use App\Modules\Resource\Enums\ResourceType;
use App\Modules\Resource\Http\Requests\StoreResourceRequest;
use App\Modules\Resource\Http\Requests\UpdateResourceRequest;
use App\Modules\Resource\Http\Resources\ResourceAdminResource;
use App\Modules\Resource\Models\Resource;
use App\Modules\Resource\Services\ResourceService;
use App\Support\Enums\ContentStatus;
use App\Support\Http\AdminListQuery;
use App\Support\Http\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Back-office CRUD for resources / insights (the same table; `resource_type`
 * `blog` is "Insights"). Route middleware enforces the `content.*` permissions;
 * publishing additionally needs `content.publish`.
 */
class ResourceAdminController extends ApiController
{
    use GuardsPublishing;
    use RecordsSlugRedirect;

    public function __construct(private readonly ResourceService $resources) {}

    public function index(Request $request): JsonResponse
    {
        $paginator = AdminListQuery::for($request, Resource::class, ['title', 'slug'], ['updated_at', 'title', 'published_at'])
            ->when($request->filled('type'), fn ($q) => $q->where('resource_type', $request->string('type')))
            ->paginate(AdminListQuery::perPage($request))
            ->withQueryString();

        return ApiResponse::page(
            $paginator,
            fn (Resource $resource) => (new ResourceAdminResource($resource))->resolve(),
            [
                'statuses' => ContentStatus::values(),
                'types' => ResourceType::values(),
            ],
        );
    }

    public function show(string $slug): JsonResponse
    {
        return ApiResponse::item(new ResourceAdminResource($this->resources->findForAdmin($slug)));
    }

    public function store(StoreResourceRequest $request): JsonResponse
    {
        $data = $request->validated();
        $this->guardPublish($request, $data['status'] ?? null);

        return ApiResponse::item(new ResourceAdminResource($this->resources->create($data)), ['created' => true])
            ->setStatusCode(201);
    }

    public function update(UpdateResourceRequest $request, string $slug): JsonResponse
    {
        $resource = $this->resources->findForAdmin($slug);
        $data = $request->validated();

        if (array_key_exists('status', $data)) {
            $this->guardPublish($request, $data['status'], $resource->status?->value);
        }

        $resource = $this->resources->update($resource, $data);
        $this->recordSlugRedirect('/resources', $slug, $resource->slug);

        return ApiResponse::item(new ResourceAdminResource($resource));
    }

    public function destroy(string $slug): JsonResponse
    {
        $resource = $this->resources->findForAdmin($slug);
        $this->resources->delete($resource);

        return ApiResponse::item(['deleted' => true, 'slug' => $resource->slug]);
    }
}
