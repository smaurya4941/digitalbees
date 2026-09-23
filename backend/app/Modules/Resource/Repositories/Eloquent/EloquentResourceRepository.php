<?php

namespace App\Modules\Resource\Repositories\Eloquent;

use App\Modules\Resource\Models\BlogCategory;
use App\Modules\Resource\Models\Resource;
use App\Modules\Resource\Repositories\Contracts\ResourceRepository;
use App\Support\Enums\ContentStatus;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Collection;

final class EloquentResourceRepository implements ResourceRepository
{
    public function paginatePublished(array $filters, int $perPage): LengthAwarePaginator
    {
        return $this->published()
            ->with('category')
            ->when(
                filled($filters['type'] ?? null),
                fn (Builder $q) => $q->where('resource_type', $filters['type']),
            )
            ->when(
                filled($filters['category'] ?? null),
                fn (Builder $q) => $q->whereHas('category', fn (Builder $c) => $c->where('slug', $filters['category'])),
            )
            ->when(
                filled($filters['tag'] ?? null),
                fn (Builder $q) => $q->whereJsonContains('tags', $filters['tag']),
            )
            ->when(
                filled($filters['q'] ?? null),
                function (Builder $q) use ($filters): void {
                    $term = '%'.addcslashes((string) $filters['q'], '%_\\').'%';
                    $q->where(fn (Builder $w) => $w->where('title', 'like', $term)->orWhere('excerpt', 'like', $term));
                },
            )
            ->when(
                ($filters['featured'] ?? null) !== null,
                fn (Builder $q) => $q->where('is_featured', (bool) $filters['featured']),
            )
            ->orderByDesc('published_at')
            ->orderByDesc('id')
            ->paginate($perPage);
    }

    public function findPublishedBySlug(string $slug): ?Resource
    {
        return $this->published()->with(['seo', 'category'])->where('slug', $slug)->first();
    }

    public function findAnyBySlug(string $slug): ?Resource
    {
        return Resource::query()->with('category')->where('slug', $slug)->first();
    }

    public function relatedPosts(Resource $post, int $limit): Collection
    {
        $base = fn () => $this->published()->blog()->with('category')->whereKeyNot($post->getKey());

        $related = $post->blog_category_id === null
            ? collect()
            : $base()->where('blog_category_id', $post->blog_category_id)
                ->orderByDesc('published_at')->limit($limit)->get();

        if ($related->count() < $limit) {
            $related = $related->concat(
                $base()->whereNotIn('id', $related->pluck('id')->all())
                    ->orderByDesc('published_at')->limit($limit - $related->count())->get(),
            );
        }

        return $related->values();
    }

    public function categoriesWithCounts(): Collection
    {
        return BlogCategory::query()
            ->ordered()
            ->withCount(['posts as published_posts_count' => fn (Builder $q) => $q->where('status', ContentStatus::Published->value)
                ->where(fn (Builder $w) => $w->whereNull('published_at')->orWhere('published_at', '<=', now()))])
            ->get();
    }

    public function create(array $attributes): Resource
    {
        return Resource::create($attributes)->load('category');
    }

    public function update(Resource $resource, array $attributes): Resource
    {
        $resource->update($attributes);

        return $resource->refresh()->load('category');
    }

    public function delete(Resource $resource): void
    {
        $resource->delete();
    }

    /**
     * Published and live: a future `published_at` (a scheduled post) stays
     * hidden until its time comes.
     *
     * @return Builder<Resource>
     */
    private function published(): Builder
    {
        return Resource::query()
            ->published()
            ->where(fn (Builder $w) => $w->whereNull('published_at')->orWhere('published_at', '<=', now()));
    }
}
