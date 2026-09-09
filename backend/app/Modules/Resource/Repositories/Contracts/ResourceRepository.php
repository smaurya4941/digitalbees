<?php

namespace App\Modules\Resource\Repositories\Contracts;

use App\Modules\Resource\Models\Resource;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface ResourceRepository
{
    /** @param  array{type?: string}  $filters */
    public function paginatePublished(array $filters, int $perPage): LengthAwarePaginator;

    public function findPublishedBySlug(string $slug): ?Resource;

    public function findAnyBySlug(string $slug): ?Resource;

    /** @param  array<string, mixed>  $attributes */
    public function create(array $attributes): Resource;

    /** @param  array<string, mixed>  $attributes */
    public function update(Resource $resource, array $attributes): Resource;

    public function delete(Resource $resource): void;
}
