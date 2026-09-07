<?php

namespace App\Modules\Resource\Repositories\Eloquent;

use App\Modules\Resource\Models\Resource;
use App\Modules\Resource\Repositories\Contracts\ResourceRepository;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

final class EloquentResourceRepository implements ResourceRepository
{
    public function paginatePublished(array $filters, int $perPage): LengthAwarePaginator
    {
        return Resource::query()
            ->published()
            ->when(
                filled($filters['type'] ?? null),
                fn ($q) => $q->where('resource_type', $filters['type']),
            )
            ->orderByDesc('published_at')
            ->orderByDesc('id')
            ->paginate($perPage);
    }

    public function findPublishedBySlug(string $slug): ?Resource
    {
        return Resource::query()->published()->with('seo')->where('slug', $slug)->first();
    }

    public function findAnyBySlug(string $slug): ?Resource
    {
        return Resource::query()->where('slug', $slug)->first();
    }

    public function create(array $attributes): Resource
    {
        return Resource::create($attributes);
    }

    public function update(Resource $resource, array $attributes): Resource
    {
        $resource->update($attributes);

        return $resource->refresh();
    }

    public function delete(Resource $resource): void
    {
        $resource->delete();
    }
}
