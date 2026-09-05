<?php

namespace App\Modules\Practice\Services;

use App\Jobs\NotifyFrontendRevalidate;
use App\Modules\CaseStudy\Services\CaseStudyService;
use App\Modules\Industry\Models\Industry;
use App\Modules\Practice\Data\PracticeDetail;
use App\Modules\Practice\Models\Practice;
use App\Modules\Practice\Models\SubService;
use App\Modules\Practice\Repositories\Contracts\PracticeRepository;
use App\Modules\Region\Models\Region;
use App\Modules\Technology\Models\Technology;
use App\Support\Enums\ContentStatus;
use Illuminate\Support\Collection;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

/**
 * Application use-cases for practices. Controllers call this; it orchestrates
 * the repository and the content graph and returns plain data.
 */
final class PracticeService
{
    public function __construct(
        private readonly PracticeRepository $practices,
        private readonly CaseStudyService $caseStudies,
    ) {}

    /** @return Collection<int, Practice> */
    public function list(): Collection
    {
        return $this->practices->allPublished();
    }

    public function detailBySlug(string $slug): ?PracticeDetail
    {
        $practice = $this->practices->findPublishedBySlug($slug);

        if ($practice === null) {
            return null;
        }

        return new PracticeDetail(
            practice: $practice,
            industries: $practice->related(Industry::class, 'serves'),
            technologies: $practice->related(Technology::class, 'built-with'),
            regions: $practice->related(Region::class, 'delivered-in'),
            relatedPractices: $this->practices->siblingsOf($practice),
            caseStudies: $this->caseStudies->forSubject($practice->getMorphClass(), $practice->id),
        );
    }

    public function subService(string $practiceSlug, string $subServiceSlug): ?SubService
    {
        return $this->practices->findPublishedSubService($practiceSlug, $subServiceSlug);
    }

    // --- Back-office use-cases ----------------------------------------------

    /** @return Collection<int, Practice> */
    public function listForAdmin(): Collection
    {
        return $this->practices->allForAdmin();
    }

    public function findForAdmin(string $slug): Practice
    {
        return $this->practices->findAnyBySlug($slug)
            ?? throw new NotFoundHttpException("Practice [{$slug}] not found.");
    }

    /** @param  array<string, mixed>  $attributes */
    public function create(array $attributes): Practice
    {
        $practice = $this->practices->create($attributes);
        $this->flush($practice);

        return $practice;
    }

    /** @param  array<string, mixed>  $attributes */
    public function update(Practice $practice, array $attributes): Practice
    {
        $practice = $this->practices->update($practice, $attributes);
        $this->flush($practice);

        return $practice;
    }

    public function delete(Practice $practice): void
    {
        $this->practices->delete($practice);
        $this->flush($practice);
    }

    private function flush(Practice $practice): void
    {
        NotifyFrontendRevalidate::dispatch(['practices', "practice:{$practice->slug}"]);
    }

    public function statuses(): array
    {
        return ContentStatus::values();
    }
}
