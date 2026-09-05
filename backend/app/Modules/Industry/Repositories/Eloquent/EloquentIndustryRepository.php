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

    public function allForAdmin(): Collection
    {
        return Industry::query()->orderBy('sort_order')->get();
    }

    public function findAnyBySlug(string $slug): ?Industry
    {
        return Industry::query()->where('slug', $slug)->first();
    }

    public function create(array $attributes): Industry
    {
        return Industry::create($attributes);
    }

    public function update(Industry $industry, array $attributes): Industry
    {
        $industry->update($attributes);
        return $industry;
    }

    public function delete(Industry $industry): void
    {
        $industry->delete();
    }
}
