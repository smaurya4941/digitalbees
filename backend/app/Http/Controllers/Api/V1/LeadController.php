<?php

namespace App\Http\Controllers\Api\V1;

use App\Modules\Lead\Http\Requests\StoreLeadRequest;
use App\Modules\Lead\Services\LeadService;
use App\Support\Http\ApiResponse;
use Illuminate\Http\JsonResponse;

/**
 * Backed by the Lead module (app/Modules/Lead).
 *
 * Flow: StoreLeadRequest (validate + honeypot via `company_website`)
 *   then LeadService::capture() (persist, score, dispatch CRM sync)
 *   then respond 202 Accepted.
 */
class LeadController extends ApiController
{
    public function __construct(private readonly LeadService $leads) {}

    public function store(StoreLeadRequest $request): JsonResponse
    {
        $lead = $this->leads->capture($request);

        return ApiResponse::accepted(['status' => 'success', 'lead_id' => $lead->id]);
    }
}
