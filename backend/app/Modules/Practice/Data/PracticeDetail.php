<?php

namespace App\Modules\Practice\Data;

use App\Modules\Practice\Models\Practice;
use Illuminate\Support\Collection;

/**
 * The fully-resolved Practice a detail page needs: the entity plus every
 * related collection the PracticeTemplate renders. Assembled by
 * {@see \App\Modules\Practice\Services\PracticeService}; shaped for the API by
 * PracticeDetailResource.
 */
final readonly class PracticeDetail
{
    /**
     * @param  Collection<int, \App\Modules\Industry\Models\Industry>  $industries
     * @param  Collection<int, \App\Modules\Technology\Models\Technology>  $technologies
     * @param  Collection<int, \App\Modules\Region\Models\Region>  $regions
     * @param  Collection<int, Practice>  $relatedPractices
     * @param  Collection<int, mixed>  $caseStudies
     */
    public function __construct(
        public Practice $practice,
        public Collection $industries,
        public Collection $technologies,
        public Collection $regions,
        public Collection $relatedPractices,
        public Collection $caseStudies,
    ) {}
}
