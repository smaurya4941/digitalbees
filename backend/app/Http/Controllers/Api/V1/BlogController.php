<?php

namespace App\Http\Controllers\Api\V1;

use App\Modules\Resource\Enums\ResourceType;
use App\Modules\Resource\Http\Resources\BlogCategoryPublicResource;
use App\Modules\Resource\Http\Resources\ResourcePublicResource;
use App\Modules\Resource\Services\ResourceService;
use App\Support\Http\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

/**
 * Public blog API — posts are `resources` with `resource_type = blog`.
 *
 *   GET /blog/posts?category=&tag=&q=&featured=&page=&per_page=
 *   GET /blog/posts/{slug}      detail + rendered body, TOC and related posts
 *   GET /blog/categories        categories with published post counts
 */
class BlogController extends ApiController
{
    private const MAX_PER_PAGE = 48;

    public function __construct(private readonly ResourceService $resources) {}

    public function index(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'category' => ['nullable', 'string', 'max:120'],
            'tag' => ['nullable', 'string', 'max:40'],
            'q' => ['nullable', 'string', 'max:100'],
            'featured' => ['nullable', 'boolean'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:'.self::MAX_PER_PAGE],
        ]);

        $filters = array_filter([
            'type' => ResourceType::Blog->value,
            'category' => $validated['category'] ?? null,
            'tag' => $validated['tag'] ?? null,
            'q' => isset($validated['q']) ? trim($validated['q']) : null,
        ], fn ($v) => $v !== null && $v !== '');

        if ($request->filled('featured')) {
            $filters['featured'] = $request->boolean('featured');
        }

        $paginator = $this->resources->listPublished($filters, (int) ($validated['per_page'] ?? 12));

        return ApiResponse::page(
            $paginator->withQueryString(),
            fn ($post) => (new ResourcePublicResource($post))->resolve(),
        );
    }

    public function show(string $slug): JsonResponse
    {
        $post = $this->resources->detailBySlug($slug);

        if ($post === null || $post->resource_type !== ResourceType::Blog) {
            throw new NotFoundHttpException("Post [{$slug}] not found.");
        }

        return ApiResponse::item(
            (new ResourcePublicResource($post))
                ->asDetail()
                ->withRelated($this->resources->relatedPosts($post, 3)),
        );
    }

    public function categories(): JsonResponse
    {
        return ApiResponse::collection(
            $this->resources->categories()
                ->map(fn ($category) => (new BlogCategoryPublicResource($category))->resolve())
                ->values(),
        );
    }
}
