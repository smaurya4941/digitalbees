<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Api\V1\Admin\Concerns\GuardsPublishing;
use App\Http\Controllers\Api\V1\Admin\Concerns\RecordsSlugRedirect;
use App\Http\Controllers\Api\V1\ApiController;
use App\Modules\Industry\Models\Industry;
use App\Modules\Practice\Http\Requests\StorePracticeRequest;
use App\Modules\Practice\Http\Requests\UpdatePracticeRequest;
use App\Modules\Practice\Http\Resources\PracticeAdminResource;
use App\Modules\Practice\Models\Practice;
use App\Modules\Practice\Services\PracticeService;
use App\Modules\Region\Models\Region;
use App\Modules\Technology\Models\Technology;
use App\Support\Enums\ContentStatus;
use App\Support\Http\AdminListQuery;
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
 *   POST   practices/{slug}/restore → content.delete (admin only)
 *
 * Publishing (moving to/from `published`) additionally needs `content.publish`,
 * checked inline so staff without it can still save drafts.
 */
class PracticeAdminController extends ApiController
{
    use GuardsPublishing;
    use RecordsSlugRedirect;

    public function __construct(private readonly PracticeService $practices) {}

    /** GET /api/v1/admin/practices — paginated, `?q=` / `?status=` / `?sort=` aware. */
    public function index(Request $request): JsonResponse
    {
        $paginator = AdminListQuery::for($request, Practice::class, ['name', 'slug'], ['updated_at', 'name', 'sort_order'])
            ->withCount('subServices')
            ->paginate(AdminListQuery::perPage($request))
            ->withQueryString();

        return ApiResponse::page(
            $paginator,
            fn (Practice $practice) => (new PracticeAdminResource($practice))->resolve(),
            ['statuses' => ContentStatus::values()],
        );
    }

    /** GET /api/v1/admin/practices/{slug} */
    public function show(string $slug): JsonResponse
    {
        $practice = $this->practices->findForAdmin($slug)
            ->loadCount('subServices')
            ->load(self::DETAIL_RELATIONS);

        return ApiResponse::item($this->present($practice));
    }

    /** GET /api/v1/admin/practices/trash — soft-deleted practices awaiting restore. */
    public function trash(): JsonResponse
    {
        return ApiResponse::collection(
            $this->practices->trashed()->map(fn (Practice $practice) => [
                ...(new PracticeAdminResource($practice))->resolve(),
                'deleted_at' => $practice->deleted_at?->toIso8601String(),
            ])->values(),
        );
    }

    /** POST /api/v1/practices/{slug}/restore */
    public function restore(string $slug): JsonResponse
    {
        $practice = $this->practices->restore($slug)->load(self::DETAIL_RELATIONS);

        return ApiResponse::item($this->present($practice), ['restored' => true]);
    }

    /**
     * GET /api/v1/admin/practices/relation-options — every industry,
     * technology and region (any status) for the relation pickers.
     */
    public function relationOptions(): JsonResponse
    {
        $options = fn (string $class, array $extra = []) => $class::query()
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get(['id', 'name', 'slug', 'status', ...$extra])
            ->map(fn ($model) => [
                'id' => $model->id,
                'name' => $model->name,
                'slug' => $model->slug,
                'status' => $model->status instanceof ContentStatus ? $model->status->value : $model->status,
                'hint' => $model->vendor_name ?? null,
            ])
            ->values();

        return ApiResponse::item([
            'industries' => $options(Industry::class),
            'technologies' => $options(Technology::class, ['vendor_name']),
            'regions' => $options(Region::class),
        ]);
    }

    /** POST /api/v1/practices */
    public function store(StorePracticeRequest $request): JsonResponse
    {
        $data = $request->validatedAttributes();
        $this->guardPublish($request, $data['status'] ?? null);

        $practice = $this->practices->create($data)->load(self::DETAIL_RELATIONS);

        return ApiResponse::item($this->present($practice), ['created' => true])
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

        $practice = $this->practices->update($practice, $data)->load(self::DETAIL_RELATIONS);
        $this->recordSlugRedirect('/practices', $slug, $practice->slug);

        return ApiResponse::item($this->present($practice));
    }

    /** DELETE /api/v1/practices/{slug} */
    public function destroy(string $slug): JsonResponse
    {
        $practice = $this->practices->findForAdmin($slug);
        $this->practices->delete($practice);

        return ApiResponse::item(['deleted' => true, 'slug' => $practice->slug]);
    }

    /** Eager loads for every full practice payload the editor receives. */
    private const DETAIL_RELATIONS = ['subServices.seo', 'capabilities', 'workflows'];

    /**
     * The editor payload: the admin resource plus the practice's
     * content-graph edges as id lists (industry_ids, technology_ids, region_ids).
     *
     * @return array<string, mixed>
     */
    private function present(Practice $practice): array
    {
        return [
            ...(new PracticeAdminResource($practice))->resolve(),
            ...$this->practices->relationIds($practice),
        ];
    }
}
