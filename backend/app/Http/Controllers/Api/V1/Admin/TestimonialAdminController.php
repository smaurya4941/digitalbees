<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Api\V1\Admin\Concerns\GuardsPublishing;
use App\Http\Controllers\Api\V1\ApiController;
use App\Modules\Testimonial\Http\Requests\StoreTestimonialRequest;
use App\Modules\Testimonial\Http\Requests\UpdateTestimonialRequest;
use App\Modules\Testimonial\Http\Resources\TestimonialAdminResource;
use App\Modules\Testimonial\Models\Testimonial;
use App\Modules\Testimonial\Services\TestimonialService;
use App\Support\Http\AdminListQuery;
use App\Support\Http\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Back-office CRUD for testimonials. Unlike every other content type,
 * `Testimonial` has no `slug` (it's a plain quote, not a page), so this
 * controller routes by `{id}` instead — see routes/api/v1.php.
 *
 *   GET    admin/testimonials         → content.update|content.publish
 *   GET    admin/testimonials/{id}    → content.update|content.publish
 *   POST   testimonials               → content.create
 *   PUT    testimonials/{id}          → content.update
 *   DELETE testimonials/{id}          → content.delete
 */
class TestimonialAdminController extends ApiController
{
    use GuardsPublishing;

    public function __construct(private readonly TestimonialService $testimonials) {}

    /** GET /api/v1/admin/testimonials — paginated, `?q=` / `?status=` / `?sort=` aware. */
    public function index(Request $request): JsonResponse
    {
        $paginator = AdminListQuery::for(
            $request,
            Testimonial::class,
            ['quote', 'author_name', 'author_company'],
            ['sort_order', 'created_at', 'author_name'],
        )
            ->when(
                $request->filled('related_type'),
                fn ($query) => $query->where('related_type', $request->string('related_type')),
            )
            ->paginate(AdminListQuery::perPage($request))
            ->withQueryString();

        return ApiResponse::page(
            $paginator,
            fn (Testimonial $testimonial) => (new TestimonialAdminResource($testimonial))->resolve(),
            ['statuses' => $this->testimonials->statuses()],
        );
    }

    /** GET /api/v1/admin/testimonials/{id} */
    public function show(int $id): JsonResponse
    {
        return ApiResponse::item(
            new TestimonialAdminResource($this->testimonials->findForAdmin($id)),
        );
    }

    /** POST /api/v1/testimonials */
    public function store(StoreTestimonialRequest $request): JsonResponse
    {
        $data = $request->validatedAttributes();
        $this->guardPublish($request, $data['status'] ?? null);

        $testimonial = $this->testimonials->create($data);

        return ApiResponse::item(new TestimonialAdminResource($testimonial), ['created' => true])
            ->setStatusCode(201);
    }

    /** PUT/PATCH /api/v1/testimonials/{id} */
    public function update(UpdateTestimonialRequest $request, int $id): JsonResponse
    {
        $testimonial = $this->testimonials->findForAdmin($id);
        $data = $request->validated();

        if (array_key_exists('status', $data)) {
            $this->guardPublish($request, $data['status'], $testimonial->status);
        }

        $testimonial = $this->testimonials->update($testimonial, $data);

        return ApiResponse::item(new TestimonialAdminResource($testimonial));
    }

    /** DELETE /api/v1/testimonials/{id} */
    public function destroy(int $id): JsonResponse
    {
        $testimonial = $this->testimonials->findForAdmin($id);
        $this->testimonials->delete($testimonial);

        return ApiResponse::item(['deleted' => true, 'id' => $testimonial->id]);
    }
}
