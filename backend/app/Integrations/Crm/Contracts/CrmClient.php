<?php

namespace App\Integrations\Crm\Contracts;

use App\Modules\Lead\Models\Lead;

/**
 * Contract every CRM provider implements (blueprint §34.1). Bound in
 * {@see \App\Integrations\Crm\CrmServiceProvider} based on
 * `config('services.crm.driver')` — `hubspot` for the real integration,
 * `log` (the safe default) for a no-op that never makes an outbound call.
 */
interface CrmClient
{
    /**
     * Push one lead to the CRM. Returns the CRM's reference id (e.g. a
     * HubSpot contact id) on success; throws on failure so the caller can
     * record the attempt and retry.
     *
     * @return array{reference_id: string|null, response: array<string, mixed>}
     */
    public function sync(Lead $lead): array;
}
