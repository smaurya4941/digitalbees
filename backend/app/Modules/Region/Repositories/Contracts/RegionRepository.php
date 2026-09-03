<?php

namespace App\Modules\Region\Repositories\Contracts;

use App\Modules\Region\Models\Region;
use Illuminate\Support\Collection;

interface RegionRepository
{
    /** @return Collection<int, Region> Published regions in display order. */
    public function allPublished(): Collection;

    public function findPublishedBySlug(string $slug): ?Region;
}
