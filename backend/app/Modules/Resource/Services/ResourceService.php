<?php

namespace App\Modules\Resource\Services;

use App\Jobs\NotifyFrontendRevalidate;
use App\Modules\Resource\Models\BlogCategory;
use App\Modules\Resource\Models\Resource;
use App\Modules\Resource\Repositories\Contracts\ResourceRepository;
use App\Modules\Resource\Support\BlogContentRenderer;
use App\Support\Enums\ContentStatus;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

final class ResourceService
{
    public function __construct(
        private readonly ResourceRepository $resources,
        private readonly BlogContentRenderer $renderer,
    ) {}

    /** @param  array{type?: string, category?: string, tag?: string, q?: string, featured?: bool}  $filters */
    public function listPublished(array $filters, int $perPage = 12): LengthAwarePaginator
    {
        return $this->resources->paginatePublished($filters, $perPage);
    }

    public function detailBySlug(string $slug): ?Resource
    {
        return $this->resources->findPublishedBySlug($slug);
    }

    /** @return Collection<int, Resource> */
    public function relatedPosts(Resource $post, int $limit = 3): Collection
    {
        return $this->resources->relatedPosts($post, $limit);
    }

    /** @return Collection<int, BlogCategory> */
    public function categories(): Collection
    {
        return $this->resources->categoriesWithCounts();
    }

    /** @return array{html: string, toc: list<array{id: string, text: string, level: int}>} */
    public function renderBody(?string $body): array
    {
        return $this->renderer->render($body);
    }

    // --- Back-office -------------------------------------------------------

    public function findForAdmin(string $slug): Resource
    {
        return $this->resources->findAnyBySlug($slug)
            ?? throw new NotFoundHttpException("Post [{$slug}] not found.");
    }

    /** @param  array<string, mixed>  $attributes */
    public function create(array $attributes): Resource
    {
        $attributes['status'] ??= ContentStatus::Draft->value;
        $this->stampPublishedAt($attributes, null);
        $this->fillReadingTime($attributes, null);

        $resource = $this->resources->create($attributes);
        $this->flush($resource);

        return $resource;
    }

    /** @param  array<string, mixed>  $attributes */
    public function update(Resource $resource, array $attributes): Resource
    {
        $previousSlug = $resource->slug;
        $this->stampPublishedAt($attributes, $resource);
        $this->fillReadingTime($attributes, $resource);

        $resource = $this->resources->update($resource, $attributes);
        $this->flush($resource, $previousSlug);

        return $resource;
    }

    public function delete(Resource $resource): void
    {
        $this->resources->delete($resource);
        $this->flush($resource);
    }

    // --- Blog categories ---------------------------------------------------

    /** @param  array<string, mixed>  $attributes */
    public function createCategory(array $attributes): BlogCategory
    {
        $category = BlogCategory::create($attributes);
        $this->flushBlog();

        return $category;
    }

    /** @param  array<string, mixed>  $attributes */
    public function updateCategory(BlogCategory $category, array $attributes): BlogCategory
    {
        $category->update($attributes);
        $this->flushBlog();

        return $category->refresh();
    }

    /** Posts in the category become uncategorised (FK is nullOnDelete). */
    public function deleteCategory(BlogCategory $category): void
    {
        $category->delete();
        $this->flushBlog();
    }

    /** @param  array<string, mixed>  $attributes */
    private function stampPublishedAt(array &$attributes, ?Resource $current): void
    {
        $becomingPublished = ($attributes['status'] ?? null) === ContentStatus::Published->value
            && $current?->published_at === null;

        if ($becomingPublished && empty($attributes['published_at'])) {
            $attributes['published_at'] = now();
        }
    }

    /**
     * An empty reading time is derived from the body, so editors only set it
     * to override the estimate.
     *
     * @param  array<string, mixed>  $attributes
     */
    private function fillReadingTime(array &$attributes, ?Resource $current): void
    {
        $touchesTime = array_key_exists('reading_time_minutes', $attributes);
        $touchesBody = array_key_exists('body', $attributes);

        if (! $touchesTime && ! $touchesBody) {
            return;
        }

        $explicit = $touchesTime ? $attributes['reading_time_minutes'] : $current?->reading_time_minutes;

        if ($explicit === null || $explicit === '' || (int) $explicit === 0) {
            $attributes['reading_time_minutes'] = Resource::estimateReadingTime(
                $touchesBody ? $attributes['body'] : $current?->body,
            );
        }
    }

    private function flush(Resource $resource, ?string $previousSlug = null): void
    {
        $tags = ['resources', 'insights', "resource:{$resource->slug}"];

        if ($previousSlug !== null && $previousSlug !== $resource->slug) {
            $tags[] = "resource:{$previousSlug}";
        }

        NotifyFrontendRevalidate::dispatch($tags);
    }

    private function flushBlog(): void
    {
        // Category names/slugs appear on every listing and post page.
        NotifyFrontendRevalidate::dispatch(['insights']);
    }
}
