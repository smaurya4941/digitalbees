<?php

namespace App\Modules\Region\Services;

use App\Modules\CaseStudy\Services\CaseStudyService;
use App\Modules\Practice\Models\Practice;
use App\Modules\Region\Data\RegionDetail;
use App\Modules\Region\Models\Region;
use App\Modules\Region\Repositories\Contracts\RegionRepository;
use Illuminate\Support\Collection;

final class RegionService
{
    public function __construct(
        private readonly RegionRepository $regions,
        private readonly CaseStudyService $caseStudies,
    ) {}

    /** @return Collection<int, Region> */
    public function list(): Collection
    {
        return $this->regions->allPublished();
    }

    public function detailBySlug(string $slug): ?RegionDetail
    {
        $region = $this->regions->findPublishedBySlug($slug);

        if ($region === null) {
            return null;
        }

        return new RegionDetail(
            region: $region,
            practices: $region->relatedInbound(Practice::class, 'delivered-in'),
            locations: $region->locations,
            caseStudies: $this->caseStudies->forSubject($region->getMorphClass(), $region->id),
        );
    }

    // --- Back-office use-cases ----------------------------------------------

    /** @return Collection<int, Region> */
    public function listForAdmin(): Collection
    {
        return $this->regions->allForAdmin();
    }

    public function findForAdmin(string $slug): Region
    {
        return $this->regions->findAnyBySlug($slug)
            ?? throw new \Symfony\Component\HttpKernel\Exception\NotFoundHttpException("Region [{$slug}] not found.");
    }

    /** @param  array<string, mixed>  $attributes */
    public function create(array $attributes): Region
    {
        $region = $this->regions->create($attributes);
        $this->flush($region);

        return $region;
    }

    /** @param  array<string, mixed>  $attributes */
    public function update(Region $region, array $attributes): Region
    {
        $region = $this->regions->update($region, $attributes);
        $this->flush($region);

        return $region;
    }

    public function delete(Region $region): void
    {
        $this->regions->delete($region);
        $this->flush($region);
    }

    private function flush(Region $region): void
    {
        \App\Jobs\NotifyFrontendRevalidate::dispatch(['regions', "region:{$region->slug}"]);
    }

    public function statuses(): array
    {
        return \App\Support\Enums\ContentStatus::values();
    }
}
