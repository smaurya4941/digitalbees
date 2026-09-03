<?php

namespace App\Modules\Industry\Repositories\Contracts;

use App\Modules\Industry\Models\Industry;
use Illuminate\Support\Collection;

interface IndustryRepository
{
    /** @return Collection<int, Industry> Published industries in display order. */
    public function allPublished(): Collection;

    public function findPublishedBySlug(string $slug): ?Industry;
}
