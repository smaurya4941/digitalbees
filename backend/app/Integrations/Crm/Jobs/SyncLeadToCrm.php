<?php

namespace App\Integrations\Crm\Jobs;

use App\Integrations\Crm\Contracts\CrmClient;
use App\Modules\Lead\Models\Lead;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\DB;
use Throwable;

/**
 * Queued CRM push (blueprint §34.1: writes go through the CRM asynchronously
 * so a slow or down CRM never blocks the visitor's form submission). Every
 * attempt — success or failure — is recorded in `crm_sync_logs` for the
 * admin lead-status view and for retry auditing.
 */
class SyncLeadToCrm implements ShouldQueue
{
    use Dispatchable;
    use InteractsWithQueue;
    use Queueable;
    use SerializesModels;

    public int $tries = 3;

    public function __construct(public readonly Lead $lead) {}

    public function handle(CrmClient $crm): void
    {
        $attempt = ($this->attempts()) ?: 1;

        try {
            $result = $crm->sync($this->lead);

            $this->lead->update([
                'status' => 'synced',
                'crm_reference_id' => $result['reference_id'],
            ]);

            $this->log($attempt, 'success', $result['response']);
        } catch (Throwable $e) {
            $this->lead->update(['status' => 'failed']);
            $this->log($attempt, 'failed', ['error' => $e->getMessage()]);

            throw $e;
        }
    }

    /** @param array<string, mixed> $response */
    private function log(int $attempt, string $status, array $response): void
    {
        DB::table('crm_sync_logs')->insert([
            'lead_id' => $this->lead->id,
            'attempt_number' => $attempt,
            'status' => $status,
            'payload' => json_encode(['form_type' => $this->lead->form_type, 'email' => $this->lead->email]),
            'response' => json_encode($response),
            'created_at' => now(),
        ]);
    }
}
