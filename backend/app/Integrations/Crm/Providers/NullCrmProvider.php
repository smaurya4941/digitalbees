<?php

namespace App\Integrations\Crm\Providers;

use App\Integrations\Crm\Contracts\CrmClient;
use App\Modules\Lead\Models\Lead;
use Illuminate\Support\Facades\Log;

/**
 * The default CRM driver (`CRM_DRIVER=log`, or any missing/misconfigured API
 * key) — a misconfigured deploy degrades to logging a sync attempt, never to
 * silently losing lead data or crashing the submission. Every lead is still
 * captured locally in `leads` regardless of this driver.
 */
class NullCrmProvider implements CrmClient
{
    public function sync(Lead $lead): array
    {
        Log::info('CRM sync skipped (no CRM driver configured)', [
            'lead_id' => $lead->id,
            'form_type' => $lead->form_type,
        ]);

        return ['reference_id' => null, 'response' => ['driver' => 'log']];
    }
}
