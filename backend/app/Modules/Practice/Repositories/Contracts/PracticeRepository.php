<?php

namespace App\Modules\Practice\Repositories\Contracts;

use App\Modules\Practice\Models\Practice;
use App\Modules\Practice\Models\SubService;
use Illuminate\Support\Collection;

/**
 * Persistence boundary for the Practice module. Controllers/services depend on
 * this contract, never on Eloquent directly.
 */
interface PracticeRepository
{
    /** @return Collection<int, Practice> Published practices, display order, with sub-service counts. */
    public function allPublished(): Collection;

    public function findPublishedBySlug(string $slug): ?Practice;

    public function findPublishedSubService(string $practiceSlug, string $subServiceSlug): ?SubService;

    /** @return Collection<int, Practice> Other published practices, for "related practices". */
    public function siblingsOf(Practice $practice, int $limit = 6): Collection;

    // --- Back-office (any status) --------------------------------------------

    /** @return Collection<int, Practice> Every practice, newest-updated first. */
    public function allForAdmin(): Collection;

    public function findAnyBySlug(string $slug): ?Practice;

    /** @param  array<string, mixed>  $attributes */
    public function create(array $attributes): Practice;

    /** @param  array<string, mixed>  $attributes */
    public function update(Practice $practice, array $attributes): Practice;

    public function delete(Practice $practice): void;
}
