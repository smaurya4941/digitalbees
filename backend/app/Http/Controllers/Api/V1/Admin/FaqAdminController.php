<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Api\V1\Admin\Concerns\GuardsPublishing;
use App\Http\Controllers\Api\V1\ApiController;
use App\Modules\Faq\Http\Requests\StoreFaqRequest;
use App\Modules\Faq\Http\Requests\UpdateFaqRequest;
use App\Modules\Faq\Http\Resources\FaqAdminResource;
use App\Modules\Faq\Models\Faq;
use App\Modules\Faq\Services\FaqService;
use App\Support\Http\AdminListQuery;
use App\Support\Http\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Back-office CRUD for FAQs. Like Testimonial, an FAQ has no `slug` (it's a
 * question/answer pair, not a page), so this controller routes by `{id}` —
 * see routes/api/v1.php.
 *
 *   GET    admin/faqs         → content.update|content.publish
 *   GET    admin/faqs/{id}    → content.update|content.publish
 *   POST   faqs               → content.create
 *   PUT    faqs/{id}          → content.update
 *   DELETE faqs/{id}          → content.delete
 */
class FaqAdminController extends ApiController
{
    use GuardsPublishing;

    public function __construct(private readonly FaqService $faqs) {}

    /** GET /api/v1/admin/faqs — paginated, `?q=` / `?status=` / `?faqable_type=` / `?faqable_id=` / `?sort=` aware. */
    public function index(Request $request): JsonResponse
    {
        $paginator = AdminListQuery::for(
            $request,
            Faq::class,
            ['question', 'answer'],
            ['sort_order', 'created_at', 'question'],
        )
            ->when(
                $request->filled('faqable_type'),
                fn ($query) => $query->where('faqable_type', $request->string('faqable_type')),
            )
            ->when(
                $request->filled('faqable_id'),
                fn ($query) => $query->where('faqable_id', $request->integer('faqable_id')),
            )
            ->paginate(AdminListQuery::perPage($request))
            ->withQueryString();

        return ApiResponse::page(
            $paginator,
            fn (Faq $faq) => (new FaqAdminResource($faq))->resolve(),
            ['statuses' => $this->faqs->statuses()],
        );
    }

    /** GET /api/v1/admin/faqs/{id} */
    public function show(int $id): JsonResponse
    {
        return ApiResponse::item(
            new FaqAdminResource($this->faqs->findForAdmin($id)),
        );
    }

    /** POST /api/v1/faqs */
    public function store(StoreFaqRequest $request): JsonResponse
    {
        $data = $request->validatedAttributes();
        $this->guardPublish($request, $data['status'] ?? null);

        $faq = $this->faqs->create($data);

        return ApiResponse::item(new FaqAdminResource($faq), ['created' => true])
            ->setStatusCode(201);
    }

    /** PUT/PATCH /api/v1/faqs/{id} */
    public function update(UpdateFaqRequest $request, int $id): JsonResponse
    {
        $faq = $this->faqs->findForAdmin($id);
        $data = $request->validated();

        if (array_key_exists('status', $data)) {
            $this->guardPublish($request, $data['status'], $faq->status);
        }

        $faq = $this->faqs->update($faq, $data);

        return ApiResponse::item(new FaqAdminResource($faq));
    }

    /** DELETE /api/v1/faqs/{id} */
    public function destroy(int $id): JsonResponse
    {
        $faq = $this->faqs->findForAdmin($id);
        $this->faqs->delete($faq);

        return ApiResponse::item(['deleted' => true, 'id' => $faq->id]);
    }
}
