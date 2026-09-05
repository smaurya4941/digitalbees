<?php

namespace App\Modules\Practice\Repositories\Eloquent;

use App\Modules\Practice\Models\Practice;
use App\Modules\Practice\Models\SubService;
use App\Modules\Practice\Repositories\Contracts\PracticeRepository;
use Illuminate\Support\Collection;

final class EloquentPracticeRepository implements PracticeRepository
{
    public function allPublished(): Collection
    {
        return Practice::query()
            ->published()
            ->ordered()
            ->withCount(['subServices as sub_services_count' => fn ($q) => $q->published()])
            ->get();
    }

    public function findPublishedBySlug(string $slug): ?Practice
    {
        $practice = Practice::query()
            ->published()
            ->with([
                'subServices' => fn ($q) => $q->published()->ordered(),
                'seo',
            ])
            ->where('slug', $slug)
            ->first();

        // Give each sub-service its parent so resources can build hrefs
        // without another query.
        $practice?->subServices->each->setRelation('practice', $practice);

        return $practice;
    }

    public function findPublishedSubService(string $practiceSlug, string $subServiceSlug): ?SubService
    {
        $practice = Practice::query()->published()->where('slug', $practiceSlug)->first();

        if ($practice === null) {
            return null;
        }

        return SubService::query()
            ->published()
            ->with('seo')
            ->where('practice_id', $practice->id)
            ->where('slug', $subServiceSlug)
            ->first()
            ?->setRelation('practice', $practice);
    }

    public function siblingsOf(Practice $practice, int $limit = 6): Collection
    {
        return Practice::query()
            ->published()
            ->ordered()
            ->whereKeyNot($practice->getKey())
            ->limit($limit)
            ->get();
    }

    public function allForAdmin(): Collection
    {
        return Practice::query()
            ->withCount('subServices')
            ->orderByDesc('updated_at')
            ->get();
    }

    public function findAnyBySlug(string $slug): ?Practice
    {
        return Practice::query()->where('slug', $slug)->first();
    }

    public function create(array $attributes): Practice
    {
        return Practice::create($attributes);
    }

    public function update(Practice $practice, array $attributes): Practice
    {
        $practice->fill($attributes)->save();

        return $practice->refresh();
    }

    public function delete(Practice $practice): void
    {
        $practice->delete();
    }
}
