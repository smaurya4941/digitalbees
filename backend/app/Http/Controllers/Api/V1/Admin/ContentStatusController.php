<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Api\V1\ApiController;
use App\Jobs\NotifyFrontendRevalidate;
use App\Modules\CaseStudy\Models\CaseStudy;
use App\Modules\Industry\Models\Industry;
use App\Modules\Practice\Models\Practice;
use App\Modules\Region\Models\Region;
use App\Modules\Technology\Models\Technology;
use App\Support\Enums\ContentStatus;
use App\Support\Http\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

/**
 * Minimal admin surface for Phase 1: move a content entity through its
 * draft / published / archived lifecycle. Full CRUD is Phase 2 (CMS).
 *
 * Guarded by `auth:sanctum` + `role:` in the route definition.
 */
class ContentStatusController extends ApiController
{
    /** @var array<string, class-string<\Illuminate\Database\Eloquent\Model>> */
    private const TYPES = [
        'practices' => Practice::class,
        'industries' => Industry::class,
        'regions' => Region::class,
        'technologies' => Technology::class,
        'case-studies' => CaseStudy::class,
    ];

    /** GET /api/v1/admin/{type} — every row regardless of status. */
    public function index(Request $request, string $type): JsonResponse
    {
        $model = $this->modelFor($type);

        $rows = $model::query()
            ->when(
                $request->filled('status'),
                fn ($q) => $q->where('status', $request->string('status')),
            )
            ->orderByDesc('updated_at')
            ->get(['id', 'slug', 'status', 'updated_at']);

        return ApiResponse::collection($rows);
    }

    /** PATCH /api/v1/admin/{type}/{slug}/status — { status }. */
    public function update(Request $request, string $type, string $slug): JsonResponse
    {
        $model = $this->modelFor($type);

        $validated = $request->validate([
            'status' => ['required', Rule::in(ContentStatus::values())],
        ]);

        $entity = $model::query()->where('slug', $slug)->first();

        if ($entity === null) {
            throw new NotFoundHttpException("[{$type}/{$slug}] not found.");
        }

        $becomingPublished = ($entity->status instanceof ContentStatus ? $entity->status->value : $entity->status) !== $validated['status']
            && $validated['status'] === ContentStatus::Published->value;

        $entity->status = $validated['status'];

        // Stamp first-publish time on entities that track it (case_studies).
        if ($becomingPublished && $entity instanceof CaseStudy && $entity->published_at === null) {
            $entity->published_at = now();
        }

        $entity->save();

        NotifyFrontendRevalidate::dispatch([$type, "{$type}:{$slug}"]);

        return ApiResponse::item([
            'type' => $type,
            'slug' => $slug,
            'status' => $entity->status instanceof ContentStatus ? $entity->status->value : $entity->status,
        ]);
    }

    /** @return class-string<\Illuminate\Database\Eloquent\Model> */
    private function modelFor(string $type): string
    {
        return self::TYPES[$type] ?? throw new NotFoundHttpException("Unknown content type [{$type}].");
    }
}
