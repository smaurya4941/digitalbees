<?php

namespace App\Modules\Region\Data;

use App\Modules\Region\Models\Region;
use Illuminate\Support\Collection;

/**
 * The fully-resolved Region a `region` template page needs.
 */
final readonly class RegionDetail
{
    /**
     * @param  Collection<int, \App\Modules\Practice\Models\Practice>  $practices
     * @param  Collection<int, \App\Modules\Region\Models\Location>  $locations
     * @param  Collection<int, \App\Modules\CaseStudy\Models\CaseStudy>  $caseStudies
     */
    public function __construct(
        public Region $region,
        public Collection $practices,
        public Collection $locations,
        public Collection $caseStudies,
    ) {}
}
