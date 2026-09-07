<?php

namespace App\Modules\Media\Repositories\Eloquent;

use App\Modules\Media\Models\Media;
use App\Modules\Media\Repositories\Contracts\MediaRepository;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

final class EloquentMediaRepository implements MediaRepository
{
    public function allForAdmin(int $perPage = 50): LengthAwarePaginator
    {
        return Media::query()->latest('id')->paginate($perPage);
    }

    public function findById(int $id): ?Media
    {
        return Media::query()->find($id);
    }

    public function create(array $attributes): Media
    {
        return Media::create($attributes);
    }

    public function update(Media $media, array $attributes): Media
    {
        $media->fill($attributes)->save();

        return $media->refresh();
    }

    public function delete(Media $media): void
    {
        $media->delete();
    }
}
