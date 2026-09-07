<?php

namespace App\Modules\Region\Repositories\Eloquent;

use App\Modules\Region\Models\Location;
use App\Modules\Region\Repositories\Contracts\LocationRepository;
use Illuminate\Support\Collection;

final class EloquentLocationRepository implements LocationRepository
{
    public function allPublished(): Collection
    {
        return Location::query()
            ->published()
            ->with('region:id,name,slug')
            ->orderBy('country')
            ->orderBy('city')
            ->get();
    }

    public function findPublishedBySlug(string $slug): ?Location
    {
        return Location::query()->published()->with(['region', 'seo'])->where('slug', $slug)->first();
    }

    public function findAnyBySlug(string $slug): ?Location
    {
        return Location::query()->where('slug', $slug)->first();
    }

    public function create(array $attributes): Location
    {
        return Location::create($attributes);
    }

    public function update(Location $location, array $attributes): Location
    {
        $location->update($attributes);

        return $location->refresh();
    }

    public function delete(Location $location): void
    {
        $location->delete();
    }
}
