<?php

namespace App\Modules\Company\Services;

use App\Modules\Company\Models\CompanyMilestone;
use App\Modules\Company\Models\Partner;
use App\Modules\Company\Models\TeamMember;
use Illuminate\Support\Collection;

/**
 * Read use-cases for the Company sub-pages (blueprint §26.1: Our Story,
 * Leadership, Partnerships). Newsroom and ESG are simple CMS pages handled
 * by {@see \App\Modules\Page\Services\PageResolutionService} instead — they
 * don't need dedicated tables or a service of their own.
 */
class CompanyService
{
    /** @return Collection<int, TeamMember> */
    public function leadership(): Collection
    {
        return TeamMember::query()
            ->published()
            ->leadership()
            ->ordered()
            ->with('photo')
            ->get();
    }

    /** @return Collection<int, Partner> */
    public function partnerships(): Collection
    {
        return Partner::query()
            ->published()
            ->ordered()
            ->with(['logo', 'technology'])
            ->get();
    }

    /** @return Collection<int, CompanyMilestone> */
    public function ourStory(): Collection
    {
        return CompanyMilestone::query()->ordered()->get();
    }
}
