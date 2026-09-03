<?php

namespace App\Modules\Technology\Data;

use App\Modules\Technology\Models\Technology;
use Illuminate\Support\Collection;

/**
 * The fully-resolved Technology a `technology` template page needs.
 */
final readonly class TechnologyDetail
{
    /**
     * @param  Collection<int, \App\Modules\Practice\Models\Practice>  $practices
     * @param  Collection<int, \App\Modules\Industry\Models\Industry>  $industries
     * @param  Collection<int, \App\Modules\CaseStudy\Models\CaseStudy>  $caseStudies
     */
    public function __construct(
        public Technology $technology,
        public Collection $practices,
        public Collection $industries,
        public Collection $caseStudies,
    ) {}
}
