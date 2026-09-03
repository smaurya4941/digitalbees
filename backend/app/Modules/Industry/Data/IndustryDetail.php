<?php

namespace App\Modules\Industry\Data;

use App\Modules\Industry\Models\Industry;
use Illuminate\Support\Collection;

/**
 * The fully-resolved Industry an `industry` template page needs.
 */
final readonly class IndustryDetail
{
    /**
     * @param  Collection<int, \App\Modules\Practice\Models\Practice>  $practices
     * @param  Collection<int, \App\Modules\Technology\Models\Technology>  $technologies
     * @param  Collection<int, \App\Modules\CaseStudy\Models\CaseStudy>  $caseStudies
     */
    public function __construct(
        public Industry $industry,
        public Collection $practices,
        public Collection $technologies,
        public Collection $caseStudies,
    ) {}
}
