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
        ]);

        // Honeypot check
        if (!empty($request->input('company_website'))) {
            return ApiResponse::accepted(['status' => 'honeypot']);
        }

        $lead = \App\Modules\Lead\Models\Lead::create([
            'full_name' => $data['full_name'],
            'email' => $data['email'],
            'phone' => $data['phone'] ?? null,
            'company' => $data['company'] ?? null,
            'message' => $data['message'] ?? null,
            'form_type' => $data['form_type'],
            'source_path' => $data['source_path'] ?? null,
            'utm' => $data['utm'] ?? null,
            'ip_address' => $request->ip(),
        ]);

        return ApiResponse::accepted(['status' => 'success', 'lead_id' => $lead->id]);
    }
}
