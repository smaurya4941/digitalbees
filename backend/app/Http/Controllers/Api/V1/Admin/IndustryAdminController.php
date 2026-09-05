<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Api\V1\ApiController;
use App\Modules\Industry\Http\Requests\StoreIndustryRequest;
use App\Modules\Industry\Http\Requests\UpdateIndustryRequest;
use App\Modules\Industry\Http\Resources\IndustryAdminResource;
use App\Modules\Industry\Services\IndustryService;
use App\Support\Enums\ContentStatus;
use App\Support\Http\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class IndustryAdminController extends ApiController
{
    public function __construct(private readonly IndustryService $industries) {}

    /** GET /api/v1/admin/industries */
    public function index(): JsonResponse
    {
        return ApiResponse::collection(
            IndustryAdminResource::collection($this->industries->listForAdmin()),
            ['statuses' => ContentStatus::values()],
        );
    }

    /** GET /api/v1/admin/industries/{slug} */
    public function show(string $slug): JsonResponse
    {
        return ApiResponse::item(
            new IndustryAdminResource($this->industries->findForAdmin($slug)),
        );
    }

    /** POST /api/v1/industries */
    public function store(StoreIndustryRequest $request): JsonResponse
    {
        $data = $request->validated();
        $this->guardPublish($request, $data['status'] ?? null);

        $industry = $this->industries->create($data);

        return ApiResponse::item(new IndustryAdminResource($industry), ['created' => true])
            ->setStatusCode(201);
    }

    /** PUT/PATCH /api/v1/industries/{slug} */
    public function update(UpdateIndustryRequest $request, string $slug): JsonResponse
    {
        $industry = $this->industries->findForAdmin($slug);
        $data = $request->validated();

        if (array_key_exists('status', $data)) {
            $this->guardPublish($request, $data['status'], $industry->status?->value);
        }

        $industry = $this->industries->update($industry, $data);

        return ApiResponse::item(new IndustryAdminResource($industry));
    }

    /** DELETE /api/v1/industries/{slug} */
    public function destroy(string $slug): JsonResponse
    {
        $industry = $this->industries->findForAdmin($slug);
        $this->industries->delete($industry);

        return ApiResponse::item(['deleted' => true, 'slug' => $industry->slug]);
    }

    /**
     * Only users with `content.publish` may set or clear the `published` state.
     */
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
