<?php

namespace App\Modules\Media\Repositories\Contracts;

use App\Modules\Media\Models\Media;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface MediaRepository
{
    /** @param  array{q?: string, folder?: string}  $filters */
    public function allForAdmin(array $filters = [], int $perPage = 50): LengthAwarePaginator;

    /** @return list<string> */
    public function folders(): array;

    public function findById(int $id): ?Media;

    /** @param array<string, mixed> $attributes */
    public function create(array $attributes): Media;

    /** @param array<string, mixed> $attributes */
    public function update(Media $media, array $attributes): Media;

    public function delete(Media $media): void;
}
