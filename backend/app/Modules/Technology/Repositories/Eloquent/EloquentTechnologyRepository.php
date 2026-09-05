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

    public function allForAdmin(): Collection
    {
        return Technology::query()->orderBy('sort_order')->get();
    }

    public function findAnyBySlug(string $slug): ?Technology
    {
        return Technology::query()->where('slug', $slug)->first();
    }

    public function create(array $attributes): Technology
    {
        return Technology::create($attributes);
    }

    public function update(Technology $technology, array $attributes): Technology
    {
        $technology->update($attributes);
        return $technology;
    }

    public function delete(Technology $technology): void
    {
        $technology->delete();
    }
}
