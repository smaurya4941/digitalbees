<?php

namespace App\Modules\Media\Repositories\Contracts;

use App\Modules\Media\Models\Media;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface MediaRepository
{
    public function allForAdmin(int $perPage = 50): LengthAwarePaginator;

    public function findById(int $id): ?Media;

    /** @param array<string, mixed> $attributes */
    public function create(array $attributes): Media;

    public function delete(Media $media): void;
}
