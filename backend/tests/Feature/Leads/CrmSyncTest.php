<?php

namespace Tests\Feature\Leads;

use App\Integrations\Crm\Jobs\SyncLeadToCrm;
use App\Modules\Lead\Models\Lead;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

/**
 * The queued CRM sync job, run for real (not faked) against the default
 * `log` driver — phpunit.xml pins CRM_DRIVER=log, so this exercises the
 * actual NullCrmProvider without an outbound HTTP call.
 */
class CrmSyncTest extends TestCase
{
    use RefreshDatabase;

    public function test_syncing_with_the_null_driver_marks_the_lead_synced_and_logs_the_attempt(): void
    {
        $lead = Lead::create([
            'full_name' => 'Jamie Rivera',
            'email' => 'jamie@example.com',
            'form_type' => 'contact',
            'status' => 'new',
        ]);

        (new SyncLeadToCrm($lead))->handle(app(\App\Integrations\Crm\Contracts\CrmClient::class));

        $lead->refresh();
        $this->assertSame('synced', $lead->status);

        $log = DB::table('crm_sync_logs')->where('lead_id', $lead->id)->first();
        $this->assertNotNull($log);
        $this->assertSame('success', $log->status);
    }
}
