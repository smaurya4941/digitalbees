<?php

namespace App\Modules\CaseStudy\Repositories\Contracts;

use App\Modules\CaseStudy\Models\CaseStudy;
use Illuminate\Support\Collection;

/**
 * Persistence boundary for the CaseStudy module.
 */
interface CaseStudyRepository
{
    /** @return Collection<int, CaseStudy> Published case studies, newest first. */
    public function allPublished(int $limit = 50): Collection;

    public function findPublishedBySlug(string $slug): ?CaseStudy;

    /**
     * Published case studies linked to the given subject (Practice, Industry, …)
     * through `entity_relations`.
     *
     * @return Collection<int, CaseStudy>
     */
    public function forSubject(string $subjectType, int $subjectId, int $limit = 6): Collection;
}
