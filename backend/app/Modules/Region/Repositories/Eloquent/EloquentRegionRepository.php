<?php

namespace App\Modules\Region\Repositories\Eloquent;

use App\Modules\Region\Models\Region;
use App\Modules\Region\Repositories\Contracts\RegionRepository;
use Illuminate\Support\Collection;

final class EloquentRegionRepository implements RegionRepository
{
    public function allPublished(): Collection
    {
        return Region::query()->published()->ordered()->get();
    }

    public function findPublishedBySlug(string $slug): ?Region
    {
        return Region::query()
            ->published()
            ->with(['seo', 'locations' => fn ($q) => $q->published()])
            ->where('slug', $slug)
            ->first();
    }

    public function allForAdmin(): Collection
    {
        return Region::query()->orderBy('sort_order')->get();
    }

    public function findAnyBySlug(string $slug): ?Region
    {
        return Region::query()->where('slug', $slug)->first();
    }

    public function create(array $attributes): Region
    {
        return Region::create($attributes);
    }

    public function update(Region $region, array $attributes): Region
    {
        $region->update($attributes);
        return $region;
    }

    public function delete(Region $region): void
    {
        $region->delete();
    }
}
