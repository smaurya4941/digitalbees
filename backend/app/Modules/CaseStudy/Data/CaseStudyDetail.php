<?php

namespace App\Modules\CaseStudy\Data;

use App\Modules\CaseStudy\Models\CaseStudy;
use Illuminate\Support\Collection;

/**
 * The fully-resolved case study a detail page needs.
 */
final readonly class CaseStudyDetail
{
    /**
     * @param  Collection<int, \App\Modules\Practice\Models\Practice>  $practices
     * @param  Collection<int, \App\Modules\Industry\Models\Industry>  $industries
     * @param  Collection<int, \App\Modules\Technology\Models\Technology>  $technologies
     * @param  Collection<int, \App\Modules\Region\Models\Region>  $regions
     */
    public function __construct(
        public CaseStudy $caseStudy,
        public Collection $practices,
        public Collection $industries,
        public Collection $technologies,
        public Collection $regions,
    ) {}
}
