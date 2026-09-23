<?php

namespace App\Modules\Resource\Repositories\Contracts;

use App\Modules\Resource\Models\BlogCategory;
use App\Modules\Resource\Models\Resource;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

interface ResourceRepository
{
    /**
     * @param  array{type?: string, category?: string, tag?: string, q?: string, featured?: bool}  $filters
     */
    public function paginatePublished(array $filters, int $perPage): LengthAwarePaginator;

    public function findPublishedBySlug(string $slug): ?Resource;

    public function findAnyBySlug(string $slug): ?Resource;

    /**
     * Published blog posts sharing the post's category, topped up with the
     * latest posts when the category alone cannot fill `$limit`.
     *
     * @return Collection<int, Resource>
     */
    public function relatedPosts(Resource $post, int $limit): Collection;

    /**
     * Every category, ordered, with `published_posts_count`.
     *
     * @return Collection<int, BlogCategory>
     */
    public function categoriesWithCounts(): Collection;

    /** @param  array<string, mixed>  $attributes */
    public function create(array $attributes): Resource;

    /** @param  array<string, mixed>  $attributes */
    public function update(Resource $resource, array $attributes): Resource;

    public function delete(Resource $resource): void;
}
