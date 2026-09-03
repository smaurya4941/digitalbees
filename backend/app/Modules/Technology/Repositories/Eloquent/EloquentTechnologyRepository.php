<?php

namespace App\Modules\Technology\Repositories\Eloquent;

use App\Modules\Technology\Models\Technology;
use App\Modules\Technology\Repositories\Contracts\TechnologyRepository;
use Illuminate\Support\Collection;

final class EloquentTechnologyRepository implements TechnologyRepository
{
    public function allPublished(): Collection
    {
        return Technology::query()->published()->ordered()->get();
    }

    public function findPublishedBySlug(string $slug): ?Technology
    {
        return Technology::query()
            ->published()
            ->with('seo')
            ->where('slug', $slug)
            ->first();
    }
}
