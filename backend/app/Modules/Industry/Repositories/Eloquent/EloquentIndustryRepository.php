<?php

namespace App\Modules\Industry\Repositories\Eloquent;

use App\Modules\Industry\Models\Industry;
use App\Modules\Industry\Repositories\Contracts\IndustryRepository;
use Illuminate\Support\Collection;

final class EloquentIndustryRepository implements IndustryRepository
{
    public function allPublished(): Collection
    {
        return Industry::query()->published()->ordered()->get();
    }

    public function findPublishedBySlug(string $slug): ?Industry
    {
        return Industry::query()
            ->published()
            ->with('seo')
            ->where('slug', $slug)
            ->first();
    }
}
