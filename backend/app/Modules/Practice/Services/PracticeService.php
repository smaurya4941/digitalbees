<?php

namespace App\Modules\Practice\Services;

use App\Jobs\NotifyFrontendRevalidate;
use App\Modules\CaseStudy\Services\CaseStudyService;
use App\Modules\Industry\Models\Industry;
use App\Modules\Practice\Data\PracticeDetail;
use App\Modules\Practice\Data\SubServiceDetail;
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

    /**
     * The full contract for the `sub-service` template (blueprint §22.3):
     * the sub-service plus up to one related case study, borrowed from its
     * parent practice's case-study graph since sub-services aren't
     * individually tagged in `entity_relations`.
     */
    public function subServiceDetail(string $practiceSlug, string $subServiceSlug): ?SubServiceDetail
    {
        $subService = $this->subService($practiceSlug, $subServiceSlug);

        if ($subService === null) {
            return null;
        }

        $practice = $subService->practice;
        $caseStudies = $practice
            ? $this->caseStudies->forSubject($practice->getMorphClass(), $practice->id, 1)
            : collect();

        return new SubServiceDetail(subService: $subService, caseStudies: $caseStudies);
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
        
        if (array_key_exists('sub_services', $attributes)) {
            $this->syncSubServices($practice, $attributes['sub_services'] ?? []);
        }

        $this->flush($practice);

        return $practice;
    }

    /** @param  array<string, mixed>  $attributes */
    public function update(Practice $practice, array $attributes): Practice
    {
        $practice = $this->practices->update($practice, $attributes);
        
        if (array_key_exists('sub_services', $attributes)) {
            $this->syncSubServices($practice, $attributes['sub_services'] ?? []);
        }

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
        $tags = ['practices', "practice:{$practice->slug}"];

        foreach ($practice->subServices()->pluck('slug') as $subServiceSlug) {
            $tags[] = "sub-service:{$practice->slug}:{$subServiceSlug}";
        }

        NotifyFrontendRevalidate::dispatch($tags);
    }

    /** @param array<int, array<string, mixed>> $subServices */
    private function syncSubServices(Practice $practice, array $subServices): void
    {
        $existingIds = $practice->subServices()->pluck('id')->toArray();
        $keptIds = [];

        foreach ($subServices as $index => $ssData) {
            $id = $ssData['id'] ?? null;
            $payload = [
                'name' => $ssData['name'],
                'slug' => $ssData['slug'] ?? \Illuminate\Support\Str::slug($ssData['name']),
                'summary' => $ssData['summary'] ?? null,
                'whats_included' => $ssData['whats_included'] ?? null,
                'status' => $ssData['status'] ?? ContentStatus::Draft->value,
                'sort_order' => $ssData['sort_order'] ?? $index,
            ];

            if ($id && in_array((int)$id, $existingIds, true)) {
                $practice->subServices()->where('id', $id)->update($payload);
                $keptIds[] = (int)$id;
            } else {
                $newSub = $practice->subServices()->create($payload);
                $keptIds[] = $newSub->id;
            }
        }

        $toDelete = array_diff($existingIds, $keptIds);
        if (!empty($toDelete)) {
            $practice->subServices()->whereIn('id', $toDelete)->delete();
        }
    }

    public function statuses(): array
    {
        return ContentStatus::values();
    }
}
