<?php

namespace App\Modules\Technology\Services;

use App\Modules\CaseStudy\Services\CaseStudyService;
use App\Modules\Industry\Models\Industry;
use App\Modules\Practice\Models\Practice;
use App\Modules\Technology\Data\TechnologyDetail;
use App\Modules\Technology\Models\Technology;
use App\Modules\Technology\Repositories\Contracts\TechnologyRepository;
use Illuminate\Support\Collection;

final class TechnologyService
{
    public function __construct(
        private readonly TechnologyRepository $technologies,
        private readonly CaseStudyService $caseStudies,
    ) {}

    /** @return Collection<int, Technology> */
    public function list(): Collection
    {
        return $this->technologies->allPublished();
    }

    public function detailBySlug(string $slug): ?TechnologyDetail
    {
        $technology = $this->technologies->findPublishedBySlug($slug);

        if ($technology === null) {
            return null;
        }

        $practices = $technology->relatedInbound(Practice::class, 'built-with');

        $industries = $practices
            ->flatMap(fn (Practice $p) => $p->related(Industry::class, 'serves'))
            ->unique('id')
            ->values();

        return new TechnologyDetail(
            technology: $technology,
            practices: $practices,
            industries: $industries,
            caseStudies: $this->caseStudies->forSubject($technology->getMorphClass(), $technology->id),
        );
    }
}
