<?php

namespace App\Modules\CaseStudy\Services;

use App\Modules\CaseStudy\Data\CaseStudyDetail;
use App\Modules\CaseStudy\Models\CaseStudy;
use App\Modules\CaseStudy\Repositories\Contracts\CaseStudyRepository;
use App\Modules\Industry\Models\Industry;
use App\Modules\Practice\Models\Practice;
use App\Modules\Region\Models\Region;
use App\Modules\Technology\Models\Technology;
use Illuminate\Support\Collection;

/**
 * Application use-cases for case studies.
 */
final class CaseStudyService
{
    public function __construct(private readonly CaseStudyRepository $caseStudies) {}

    /** @return Collection<int, CaseStudy> */
    public function list(int $limit = 50): Collection
    {
        return $this->caseStudies->allPublished($limit);
    }

    public function detailBySlug(string $slug): ?CaseStudyDetail
    {
        $study = $this->caseStudies->findPublishedBySlug($slug);

        if ($study === null) {
            return null;
        }

        return new CaseStudyDetail(
            caseStudy: $study,
            practices: $study->related(Practice::class),
            industries: $study->related(Industry::class),
            technologies: $study->related(Technology::class),
            regions: $study->related(Region::class),
        );
    }

    /** @return Collection<int, CaseStudy> */
    public function forSubject(string $morphType, int $id, int $limit = 6): Collection
    {
        return $this->caseStudies->forSubject($morphType, $id, $limit);
    }
}
