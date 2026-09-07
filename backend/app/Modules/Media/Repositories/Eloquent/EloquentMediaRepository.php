<?php

namespace App\Modules\Media\Repositories\Eloquent;

use App\Modules\Media\Models\Media;
use App\Modules\Media\Repositories\Contracts\MediaRepository;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

final class EloquentMediaRepository implements MediaRepository
{
    public function allForAdmin(array $filters = [], int $perPage = 50): LengthAwarePaginator
    {
        return Media::query()
            ->when(
                filled($filters['q'] ?? null),
                fn ($q) => $q->where(fn ($w) => $w
                    ->where('name', 'like', '%'.$filters['q'].'%')
                    ->orWhere('alt_text', 'like', '%'.$filters['q'].'%')),
            )
            ->when(
                array_key_exists('folder', $filters),
                fn ($q) => $filters['folder'] === ''
                    ? $q->whereNull('folder')
                    : $q->where('folder', $filters['folder']),
            )
            ->latest('id')
            ->paginate($perPage);
    }

    /** @return list<string> */
    public function folders(): array
    {
        return Media::query()
            ->whereNotNull('folder')
            ->distinct()
            ->orderBy('folder')
            ->pluck('folder')
            ->all();
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
