<?php

namespace App\Modules\Resource\Services;

use App\Jobs\NotifyFrontendRevalidate;
use App\Modules\Resource\Models\Resource;
use App\Modules\Resource\Repositories\Contracts\ResourceRepository;
use App\Support\Enums\ContentStatus;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

final class ResourceService
{
    public function __construct(private readonly ResourceRepository $resources) {}

    /** @param  array{type?: string}  $filters */
    public function listPublished(array $filters, int $perPage = 12): LengthAwarePaginator
    {
        return $this->resources->paginatePublished($filters, $perPage);
    }

    public function detailBySlug(string $slug): ?Resource
    {
        return $this->resources->findPublishedBySlug($slug);
    }

    // --- Back-office -------------------------------------------------------

    public function findForAdmin(string $slug): Resource
    {
        return $this->resources->findAnyBySlug($slug)
            ?? throw new NotFoundHttpException("Resource [{$slug}] not found.");
    }

    /** @param  array<string, mixed>  $attributes */
    public function create(array $attributes): Resource
    {
        $attributes['status'] ??= ContentStatus::Draft->value;
        $this->stampPublishedAt($attributes, null);

        $resource = $this->resources->create($attributes);
        $this->flush($resource);

        return $resource;
    }

    /** @param  array<string, mixed>  $attributes */
    public function update(Resource $resource, array $attributes): Resource
    {
        $this->stampPublishedAt($attributes, $resource);

        $resource = $this->resources->update($resource, $attributes);
        $this->flush($resource);

        return $resource;
    }

    public function delete(Resource $resource): void
    {
        $this->resources->delete($resource);
        $this->flush($resource);
    }

    /** @param  array<string, mixed>  $attributes */
    private function stampPublishedAt(array &$attributes, ?Resource $current): void
    {
        $becomingPublished = ($attributes['status'] ?? null) === ContentStatus::Published->value
            && $current?->published_at === null;

        if ($becomingPublished && ! array_key_exists('published_at', $attributes)) {
            $attributes['published_at'] = now();
        }
    }

    private function flush(Resource $resource): void
    {
        NotifyFrontendRevalidate::dispatch([
            'resources',
            'insights',
            "resource:{$resource->slug}",
        ]);
    }
}
