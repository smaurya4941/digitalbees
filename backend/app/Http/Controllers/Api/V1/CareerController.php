<?php

namespace App\Http\Controllers\Api\V1;

use App\Modules\Career\Http\Requests\ApplyToJobRequest;
use App\Modules\Career\Http\Resources\JobPostingPublicResource;
use App\Modules\Career\Services\CareerService;
use App\Support\Http\ApiResponse;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

/**
 * Public careers feed (open roles only) + candidate applications. Backed by
 * the Career module: job_postings + job_applications.
 */
class CareerController extends ApiController
{
    public function __construct(private readonly CareerService $careers) {}

    public function index(): JsonResponse
    {
        return ApiResponse::collection(
            $this->careers->listOpen()->map(fn ($job) => (new JobPostingPublicResource($job))->resolve()),
        );
    }

    public function show(string $career): JsonResponse
    {
        $job = $this->careers->openDetailBySlug($career)
            ?? throw new NotFoundHttpException("Role [{$career}] not found.");

        return ApiResponse::item((new JobPostingPublicResource($job))->asDetail());
    }

    public function apply(ApplyToJobRequest $request, string $career): JsonResponse
    {
        $this->careers->apply($career, $request->validated());

        return ApiResponse::accepted(['status' => 'received']);
    }
}
