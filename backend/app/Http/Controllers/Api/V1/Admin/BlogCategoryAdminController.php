<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Api\V1\ApiController;
use App\Modules\Resource\Http\Requests\BlogCategoryRequest;
use App\Modules\Resource\Http\Resources\BlogCategoryAdminResource;
use App\Modules\Resource\Models\BlogCategory;
use App\Modules\Resource\Services\ResourceService;
use App\Support\Http\ApiResponse;
use Illuminate\Http\JsonResponse;

/**
 * Back-office CRUD for blog categories. The list is small, so it is returned
 * whole (ordered, with post counts) rather than paginated.
 */
class BlogCategoryAdminController extends ApiController
{
    public function __construct(private readonly ResourceService $resources) {}

    public function index(): JsonResponse
    {
        $categories = BlogCategory::query()->ordered()->withCount('posts')->get();

        return ApiResponse::collection(
            $categories->map(fn (BlogCategory $c) => (new BlogCategoryAdminResource($c))->resolve())->values(),
        );
    }

    public function store(BlogCategoryRequest $request): JsonResponse
    {
        $category = $this->resources->createCategory($request->validated());

        return ApiResponse::item(new BlogCategoryAdminResource($category), ['created' => true])
            ->setStatusCode(201);
    }

    public function update(BlogCategoryRequest $request, int $id): JsonResponse
    {
        $category = BlogCategory::query()->findOrFail($id);

        return ApiResponse::item(
            new BlogCategoryAdminResource($this->resources->updateCategory($category, $request->validated())),
        );
    }

    public function destroy(int $id): JsonResponse
    {
        $category = BlogCategory::query()->findOrFail($id);
        $this->resources->deleteCategory($category);

        return ApiResponse::item(['deleted' => true, 'id' => $id]);
    }
}
