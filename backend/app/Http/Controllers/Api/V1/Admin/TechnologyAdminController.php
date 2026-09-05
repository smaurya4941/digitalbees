<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Api\V1\ApiController;
use App\Modules\Technology\Http\Requests\StoreTechnologyRequest;
use App\Modules\Technology\Http\Requests\UpdateTechnologyRequest;
use App\Modules\Technology\Http\Resources\TechnologyAdminResource;
use App\Modules\Technology\Services\TechnologyService;
use App\Support\Enums\ContentStatus;
use App\Support\Http\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TechnologyAdminController extends ApiController
{
    public function __construct(private readonly TechnologyService $technologies) {}

    public function index(): JsonResponse
    {
        return ApiResponse::collection(
            TechnologyAdminResource::collection($this->technologies->listForAdmin()),
            ['statuses' => ContentStatus::values()],
        );
    }

    public function show(string $slug): JsonResponse
    {
        return ApiResponse::item(
            new TechnologyAdminResource($this->technologies->findForAdmin($slug)),
        );
    }

    public function store(StoreTechnologyRequest $request): JsonResponse
    {
        $data = $request->validated();
        $this->guardPublish($request, $data['status'] ?? null);

        $technology = $this->technologies->create($data);

        return ApiResponse::item(new TechnologyAdminResource($technology), ['created' => true])
            ->setStatusCode(201);
    }

    public function update(UpdateTechnologyRequest $request, string $slug): JsonResponse
    {
        $technology = $this->technologies->findForAdmin($slug);
        $data = $request->validated();

        if (array_key_exists('status', $data)) {
            $this->guardPublish($request, $data['status'], $technology->status?->value);
        }

        $technology = $this->technologies->update($technology, $data);

        return ApiResponse::item(new TechnologyAdminResource($technology));
    }

    public function destroy(string $slug): JsonResponse
    {
        $technology = $this->technologies->findForAdmin($slug);
        $this->technologies->delete($technology);

        return ApiResponse::item(['deleted' => true, 'slug' => $technology->slug]);
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
