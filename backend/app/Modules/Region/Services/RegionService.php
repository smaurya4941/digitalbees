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
}
