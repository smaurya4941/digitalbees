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

    // --- Back-office use-cases ----------------------------------------------

    /** @return Collection<int, CaseStudy> */
    public function listForAdmin(): Collection
    {
        return $this->caseStudies->allForAdmin();
    }

    public function findForAdmin(string $slug): CaseStudy
    {
        return $this->caseStudies->findAnyBySlug($slug)
            ?? throw new \Symfony\Component\HttpKernel\Exception\NotFoundHttpException("CaseStudy [{$slug}] not found.");
    }

    /** @param  array<string, mixed>  $attributes */
    public function create(array $attributes): CaseStudy
    {
        $caseStudy = $this->caseStudies->create($attributes);
        $this->flush($caseStudy);

        return $caseStudy;
    }

    /** @param  array<string, mixed>  $attributes */
    public function update(CaseStudy $caseStudy, array $attributes): CaseStudy
    {
        $caseStudy = $this->caseStudies->update($caseStudy, $attributes);
        $this->flush($caseStudy);

        return $caseStudy;
    }

    public function delete(CaseStudy $caseStudy): void
    {
        $this->caseStudies->delete($caseStudy);
        $this->flush($caseStudy);
    }

    private function flush(CaseStudy $caseStudy): void
    {
        \App\Jobs\NotifyFrontendRevalidate::dispatch(['case-studies', "case-study:{$caseStudy->slug}"]);
    }

    public function statuses(): array
    {
        return \App\Support\Enums\ContentStatus::values();
    }
}
