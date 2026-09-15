<?php

namespace App\Http\Controllers\Api\V1;

use App\Modules\Company\Http\Resources\CompanyMilestoneResource;
use App\Modules\Company\Http\Resources\PartnerResource;
use App\Modules\Company\Http\Resources\TeamMemberResource;
use App\Modules\Company\Services\CompanyService;
use App\Support\Http\ApiResponse;
use Illuminate\Http\JsonResponse;

/**
 * The three Company sub-pages backed by dedicated tables (blueprint §26.1):
 * Leadership (`team_members`), Partnerships (`partners`), Our Story
 * (`company_milestones`). Newsroom and ESG are simple CMS pages resolved
 * through `GET /pages/resolve` instead — see PageResolutionService.
 */
class CompanyController extends ApiController
{
    public function __construct(private readonly CompanyService $company) {}

    public function leadership(): JsonResponse
    {
        return ApiResponse::collection(TeamMemberResource::collection($this->company->leadership())->resolve());
    }

    public function partnerships(): JsonResponse
    {
        return ApiResponse::collection(PartnerResource::collection($this->company->partnerships())->resolve());
    }

    public function ourStory(): JsonResponse
    {
        return ApiResponse::collection(CompanyMilestoneResource::collection($this->company->ourStory())->resolve());
    }
}
