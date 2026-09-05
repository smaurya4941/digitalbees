<?php

namespace App\Modules\CaseStudy\Repositories\Eloquent;

use App\Modules\CaseStudy\Models\CaseStudy;
use App\Modules\CaseStudy\Repositories\Contracts\CaseStudyRepository;
use App\Support\Models\EntityRelation;
use Illuminate\Support\Collection;

final class EloquentCaseStudyRepository implements CaseStudyRepository
{
    public function allPublished(int $limit = 50): Collection
    {
        return CaseStudy::query()
            ->published()
            ->ordered()
            ->limit($limit)
            ->get();
    }

    public function findPublishedBySlug(string $slug): ?CaseStudy
    {
        return CaseStudy::query()
            ->published()
            ->with('seo')
            ->where('slug', $slug)
            ->first();
    }

    public function forSubject(string $subjectType, int $subjectId, int $limit = 6): Collection
    {
        $caseStudyType = (new CaseStudy)->getMorphClass();

        $ids = EntityRelation::query()
            ->where('subject_type', $subjectType)
            ->where('subject_id', $subjectId)
            ->where('related_type', $caseStudyType)
            ->orderBy('sort_order')
            ->pluck('related_id')
            // Also accept edges authored in the other direction.
            ->merge(
                EntityRelation::query()
                    ->where('related_type', $subjectType)
                    ->where('related_id', $subjectId)
                    ->where('subject_type', $caseStudyType)
                    ->orderBy('sort_order')
                    ->pluck('subject_id')
            )
            ->unique()
            ->values();

        if ($ids->isEmpty()) {
            return new Collection;
        }

        return CaseStudy::query()
            ->published()
            ->whereIn('id', $ids)
            ->ordered()
            ->limit($limit)
            ->get();
    }

    public function allForAdmin(): Collection
    {
        return CaseStudy::query()->orderBy('sort_order')->get();
    }

    public function findAnyBySlug(string $slug): ?CaseStudy
    {
        return CaseStudy::query()->where('slug', $slug)->first();
    }

    public function create(array $attributes): CaseStudy
    {
        return CaseStudy::create($attributes);
    }

    public function update(CaseStudy $caseStudy, array $attributes): CaseStudy
    {
        $caseStudy->update($attributes);
        return $caseStudy;
    }

    public function delete(CaseStudy $caseStudy): void
    {
        $caseStudy->delete();
    }
}
