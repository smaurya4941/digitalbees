<?php

namespace App\Modules\Technology\Repositories\Contracts;

use App\Modules\Technology\Models\Technology;
use Illuminate\Support\Collection;

interface TechnologyRepository
{
    /** @return Collection<int, Technology> Published technologies in display order. */
    public function allPublished(): Collection;

    public function findPublishedBySlug(string $slug): ?Technology;
}
