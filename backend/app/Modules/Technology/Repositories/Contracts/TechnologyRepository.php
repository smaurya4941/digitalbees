<?php

namespace App\Modules\Technology\Repositories\Contracts;

use App\Modules\Technology\Models\Technology;
use Illuminate\Support\Collection;

interface TechnologyRepository
{
    /** @return Collection<int, Technology> Published technologies in display order. */
    public function allPublished(): Collection;

    public function findPublishedBySlug(string $slug): ?Technology;

    /** @return Collection<int, Technology> All technologies for the back-office. */
    public function allForAdmin(): Collection;

    public function findAnyBySlug(string $slug): ?Technology;

    /** @param array<string, mixed> $attributes */
    public function create(array $attributes): Technology;

    /** @param array<string, mixed> $attributes */
    public function update(Technology $technology, array $attributes): Technology;

    public function delete(Technology $technology): void;
}
