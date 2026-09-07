<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Api\V1\Admin\Concerns\GuardsPublishing;
use App\Http\Controllers\Api\V1\ApiController;
use App\Modules\CaseStudy\Http\Requests\StoreCaseStudyRequest;
use App\Modules\CaseStudy\Http\Requests\UpdateCaseStudyRequest;
use App\Modules\CaseStudy\Http\Resources\CaseStudyAdminResource;
use App\Modules\CaseStudy\Services\CaseStudyService;
use App\Support\Enums\ContentStatus;
use App\Support\Http\ApiResponse;
use Illuminate\Http\JsonResponse;

class CaseStudyAdminController extends ApiController
{
    use GuardsPublishing;

    public function __construct(private readonly CaseStudyService $caseStudies) {}

    public function index(): JsonResponse
    {
        return ApiResponse::collection(
            CaseStudyAdminResource::collection($this->caseStudies->listForAdmin()),
            ['statuses' => ContentStatus::values()],
        );
    }

    public function show(string $slug): JsonResponse
    {
        return ApiResponse::item(
            new CaseStudyAdminResource($this->caseStudies->findForAdmin($slug)),
        );
    }

    public function store(StoreCaseStudyRequest $request): JsonResponse
    {
        $data = $request->validated();
        $this->guardPublish($request, $data['status'] ?? null);

        $caseStudy = $this->caseStudies->create($data);

        return ApiResponse::item(new CaseStudyAdminResource($caseStudy), ['created' => true])
            ->setStatusCode(201);
    }

    public function update(UpdateCaseStudyRequest $request, string $slug): JsonResponse
    {
        $caseStudy = $this->caseStudies->findForAdmin($slug);
        $data = $request->validated();

        if (array_key_exists('status', $data)) {
            $this->guardPublish($request, $data['status'], $caseStudy->status?->value);
        }

        $caseStudy = $this->caseStudies->update($caseStudy, $data);

        return ApiResponse::item(new CaseStudyAdminResource($caseStudy));
    }

    public function destroy(string $slug): JsonResponse
    {
        $caseStudy = $this->caseStudies->findForAdmin($slug);
        $this->caseStudies->delete($caseStudy);

        return ApiResponse::item(['deleted' => true, 'slug' => $caseStudy->slug]);
    }
}
