<?php

namespace App\Modules\Region\Repositories\Contracts;

use App\Modules\Region\Models\Location;
use Illuminate\Support\Collection;

interface LocationRepository
{
    /** @return Collection<int, Location> Published offices with their region. */
    public function allPublished(): Collection;

    public function findPublishedBySlug(string $slug): ?Location;

    public function findAnyBySlug(string $slug): ?Location;

    /** @param  array<string, mixed>  $attributes */
    public function create(array $attributes): Location;

    /** @param  array<string, mixed>  $attributes */
    public function update(Location $location, array $attributes): Location;

    public function delete(Location $location): void;
}
