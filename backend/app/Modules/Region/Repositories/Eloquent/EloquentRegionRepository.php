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
}
