<?php

namespace App\Http\Controllers\Api\V1;

use App\Support\Http\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Backed by the Lead module (app/Modules/Lead).
 *
 * Flow: StoreLeadRequest (validate + honeypot + rate limit)
 *   then LeadService::capture() (persist locally, status=new)
 *   then LeadScoringService::score()
 *   then dispatch the SyncLeadToCrm job (app/Integrations/Crm)
 *   then respond 202 Accepted.
 */
class LeadController extends ApiController
{
    public function store(Request $request): JsonResponse
    {
        // TODO: replace with a StoreLeadRequest in app/Modules/Lead/Http/Requests.
        $data = $request->validate([
            'full_name' => ['required', 'string', 'max:150'],
            'email' => ['required', 'email', 'max:150'],
            'phone' => ['nullable', 'string', 'max:50'],
            'company' => ['nullable', 'string', 'max:150'],
            'message' => ['nullable', 'string', 'max:5000'],
            'form_type' => ['required', 'in:contact,demo_request,newsletter,chatbot'],
            'source_path' => ['nullable', 'string', 'max:500'],
            'utm' => ['nullable', 'array'],
            'company_website' => ['prohibited'], // honeypot
        ]);

        return ApiResponse::accepted(['status' => 'stub', 'form_type' => $data['form_type']]);
    }
}
