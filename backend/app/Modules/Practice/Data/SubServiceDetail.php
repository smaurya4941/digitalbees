<?php

namespace App\Modules\Practice\Data;

use App\Modules\Practice\Models\SubService;
use Illuminate\Support\Collection;

/**
 * The fully-resolved sub-service a `/practices/{practice}/{sub-service}` page
 * needs: the entity plus one related case study, if the parent practice has
 * one (blueprint §22.3). Assembled by
 * {@see \App\Modules\Practice\Services\PracticeService::subServiceDetail()};
 * shaped for the API by SubServiceResource.
 */
final readonly class SubServiceDetail
{
    /** @param  Collection<int, mixed>  $caseStudies */
    public function __construct(
        public SubService $subService,
        public Collection $caseStudies,
    ) {}
}
