<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Api\V1\ApiController;
use App\Modules\Practice\Http\Requests\StorePracticeRequest;
use App\Modules\Practice\Http\Requests\UpdatePracticeRequest;
use App\Modules\Practice\Http\Resources\PracticeAdminResource;
use App\Modules\Practice\Services\PracticeService;
use App\Support\Enums\ContentStatus;
use App\Support\Http\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Back-office CRUD for practices — the reference implementation for every
 * content type. HTTP authorization is enforced by `permission:` middleware on
 * the routes (see routes/api/v1.php):
 *
 *   POST   practices           → content.create   (admin, staff)
 *   PUT    practices/{slug}     → content.update   (admin, staff)
 *   DELETE practices/{slug}     → content.delete   (admin only)
 *
 * Publishing (moving to/from `published`) additionally needs `content.publish`,
 * checked inline so staff without it can still save drafts.
 */
class PracticeAdminController extends ApiController
{
    public function __construct(private readonly PracticeService $practices) {}

    /** GET /api/v1/admin/practices */
    public function index(): JsonResponse
    {
        return ApiResponse::collection(
            PracticeAdminResource::collection($this->practices->listForAdmin()),
            ['statuses' => ContentStatus::values()],
        );
    }

    /** GET /api/v1/admin/practices/{slug} */
    public function show(string $slug): JsonResponse
    {
        return ApiResponse::item(
            new PracticeAdminResource($this->practices->findForAdmin($slug)->loadCount('subServices')),
        );
    }

    /** POST /api/v1/practices */
    public function store(StorePracticeRequest $request): JsonResponse
    {
        $data = $request->validatedAttributes();
        $this->guardPublish($request, $data['status'] ?? null);

        $practice = $this->practices->create($data);

        return ApiResponse::item(new PracticeAdminResource($practice), ['created' => true])
            ->setStatusCode(201);
    }

    /** PUT/PATCH /api/v1/practices/{slug} */
    public function update(UpdatePracticeRequest $request, string $slug): JsonResponse
    {
        $practice = $this->practices->findForAdmin($slug);
        $data = $request->validated();

        if (array_key_exists('status', $data)) {
            $this->guardPublish($request, $data['status'], $practice->status?->value);
        }

        $practice = $this->practices->update($practice, $data);

        return ApiResponse::item(new PracticeAdminResource($practice));
    }

    /** DELETE /api/v1/practices/{slug} */
    public function destroy(string $slug): JsonResponse
    {
        $practice = $this->practices->findForAdmin($slug);
        $this->practices->delete($practice);

        return ApiResponse::item(['deleted' => true, 'slug' => $practice->slug]);
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
