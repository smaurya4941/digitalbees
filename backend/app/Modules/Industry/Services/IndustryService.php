<?php

namespace App\Modules\Industry\Services;

use App\Modules\CaseStudy\Services\CaseStudyService;
use App\Modules\Industry\Data\IndustryDetail;
use App\Modules\Industry\Models\Industry;
use App\Modules\Industry\Repositories\Contracts\IndustryRepository;
use App\Modules\Practice\Models\Practice;
use App\Modules\Technology\Models\Technology;
use Illuminate\Support\Collection;

final class IndustryService
{
    public function __construct(
        private readonly IndustryRepository $industries,
        private readonly CaseStudyService $caseStudies,
    ) {}

    /** @return Collection<int, Industry> */
    public function list(): Collection
    {
        return $this->industries->allPublished();
    }

    public function detailBySlug(string $slug): ?IndustryDetail
    {
        $industry = $this->industries->findPublishedBySlug($slug);

        if ($industry === null) {
            return null;
        }

        // Practices that declare they `serve` this industry (inbound edges).
        $practices = $industry->relatedInbound(Practice::class, 'serves');

        // Direct industry->technology edges, falling back to the union of
        // technologies used by the serving practices.
        $technologies = $industry->related(Technology::class);
        if ($technologies->isEmpty()) {
            $technologies = $practices
                ->flatMap(fn (Practice $p) => $p->related(Technology::class, 'built-with'))
                ->unique('id')
                ->values();
        }

        return new IndustryDetail(
            industry: $industry,
            practices: $practices,
            technologies: $technologies,
            caseStudies: $this->caseStudies->forSubject($industry->getMorphClass(), $industry->id),
        );
    }
}
