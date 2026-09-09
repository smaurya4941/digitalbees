<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Api\V1\Admin\Concerns\RecordsSlugRedirect;
use App\Http\Controllers\Api\V1\ApiController;
use App\Modules\Career\Enums\JobStatus;
use App\Modules\Career\Http\Requests\StoreJobPostingRequest;
use App\Modules\Career\Http\Requests\UpdateJobPostingRequest;
use App\Modules\Career\Http\Resources\JobPostingAdminResource;
use App\Modules\Career\Models\JobPosting;
use App\Modules\Career\Services\CareerService;
use App\Support\Http\AdminListQuery;
use App\Support\Http\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Back-office CRUD for job postings. `content.*` permissions are enforced by
 * route middleware; moving a role into or out of the public `open` state also
 * needs `content.publish` (checked inline — jobs use their own status enum).
 */
class CareerAdminController extends ApiController
{
    use RecordsSlugRedirect;

    public function __construct(private readonly CareerService $careers) {}

    public function index(Request $request): JsonResponse
    {
        $paginator = AdminListQuery::for($request, JobPosting::class, ['title', 'slug'], ['updated_at', 'title', 'posted_at'])
            ->withCount('applications')
            ->with('location:id,name')
            ->paginate(AdminListQuery::perPage($request))
            ->withQueryString();

        return ApiResponse::page(
            $paginator,
            fn (JobPosting $job) => (new JobPostingAdminResource($job))->resolve(),
            ['statuses' => JobStatus::values()],
        );
    }

    public function show(string $slug): JsonResponse
    {
        return ApiResponse::item(
            new JobPostingAdminResource($this->careers->findForAdmin($slug)->loadCount('applications')->load('location')),
        );
    }

    public function store(StoreJobPostingRequest $request): JsonResponse
    {
        $data = $request->validated();
        $this->guardOpen($request, $data['status'] ?? null);

        return ApiResponse::item(new JobPostingAdminResource($this->careers->create($data)), ['created' => true])
            ->setStatusCode(201);
    }

    public function update(UpdateJobPostingRequest $request, string $slug): JsonResponse
    {
        $job = $this->careers->findForAdmin($slug);
        $data = $request->validated();

        if (array_key_exists('status', $data)) {
            $this->guardOpen($request, $data['status'], $job->status->value);
        }

        $job = $this->careers->update($job, $data);
        $this->recordSlugRedirect('/careers', $slug, $job->slug);

        return ApiResponse::item(new JobPostingAdminResource($job->load('location')));
    }

    public function destroy(string $slug): JsonResponse
    {
        $job = $this->careers->findForAdmin($slug);
        $this->careers->delete($job);

        return ApiResponse::item(['deleted' => true, 'slug' => $job->slug]);
    }

    /** GET /api/v1/admin/careers/{slug}/applications — read-only, `inquiries.view`. */
    public function applications(Request $request, string $slug): JsonResponse
    {
        $job = $this->careers->findForAdmin($slug);

        return ApiResponse::page(
            $this->careers->applications($job, AdminListQuery::perPage($request, 25)),
            fn ($application) => [
                'id' => $application->id,
                'full_name' => $application->full_name,
                'email' => $application->email,
                'phone' => $application->phone,
                'cover_note' => $application->cover_note,
                'status' => $application->status,
                'created_at' => $application->created_at?->toIso8601String(),
            ],
        );
    }

    private function guardOpen(Request $request, ?string $next, ?string $current = null): void
    {
        if ($next === null || $next === $current) {
            return;
        }

        $touchesOpen = $next === JobStatus::Open->value || $current === JobStatus::Open->value;

        if ($touchesOpen && $request->user()?->cannot('content.publish')) {
            abort(403, 'Opening or closing a role requires the content.publish permission.');
        }
    }
}
