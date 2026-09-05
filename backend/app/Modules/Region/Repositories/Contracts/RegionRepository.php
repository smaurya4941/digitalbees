<?php

namespace App\Modules\Region\Repositories\Contracts;

use App\Modules\Region\Models\Region;
use Illuminate\Support\Collection;

interface RegionRepository
{
    /** @return Collection<int, Region> Published regions in display order. */
    public function allPublished(): Collection;

    public function findPublishedBySlug(string $slug): ?Region;

    /** @return Collection<int, Region> All regions for the back-office. */
    public function allForAdmin(): Collection;

    public function findAnyBySlug(string $slug): ?Region;

    /** @param array<string, mixed> $attributes */
    public function create(array $attributes): Region;

    /** @param array<string, mixed> $attributes */
    public function update(Region $region, array $attributes): Region;

    public function delete(Region $region): void;
}
