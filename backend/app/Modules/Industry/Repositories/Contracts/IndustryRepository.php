<?php

namespace App\Modules\Industry\Repositories\Contracts;

use App\Modules\Industry\Models\Industry;
use Illuminate\Support\Collection;

interface IndustryRepository
{
    /** @return Collection<int, Industry> Published industries in display order. */
    public function allPublished(): Collection;

    public function findPublishedBySlug(string $slug): ?Industry;

    /** @return Collection<int, Industry> All industries for the back-office. */
    public function allForAdmin(): Collection;

    public function findAnyBySlug(string $slug): ?Industry;

    /** @param array<string, mixed> $attributes */
    public function create(array $attributes): Industry;

    /** @param array<string, mixed> $attributes */
    public function update(Industry $industry, array $attributes): Industry;

    public function delete(Industry $industry): void;
}
