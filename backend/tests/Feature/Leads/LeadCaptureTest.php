<?php

namespace Tests\Feature\Leads;

use App\Integrations\Crm\Jobs\SyncLeadToCrm;
use App\Modules\Lead\Models\Lead;
use Database\Seeders\PracticeSeeder;
use Database\Seeders\RegionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Queue;
use Tests\TestCase;

/**
 * Public lead capture (blueprint §28.2's conversion flows all post here).
 * Regression coverage for two real bugs: the honeypot (`company_website`)
 * wasn't in the request's validation rules at all, and `source_path` was
 * passed straight to `Lead::create()` though no such column exists (it's
 * `source_page_id`) — silently dropped.
 */
class LeadCaptureTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed([PracticeSeeder::class, RegionSeeder::class]);
    }

    public function test_a_valid_submission_is_captured_scored_and_queued_for_crm_sync(): void
    {
        Queue::fake();

        $response = $this->postJson('/api/v1/leads', [
            'full_name' => 'Jamie Rivera',
            'email' => 'jamie@example.com',
            'company' => 'Acme Corp',
            'message' => 'We need help scaling our engineering team for a major product launch next quarter.',
            'form_type' => 'demo_request',
            'practice_slug' => 'ai-bees',
            'region_slug' => 'uk',
        ]);

        $response->assertStatus(202)->assertJsonPath('data.status', 'success');

        $lead = Lead::first();
        $this->assertNotNull($lead);
        $this->assertSame('jamie@example.com', $lead->email);
        $this->assertNotNull($lead->practice_id);
        $this->assertNotNull($lead->region_id);
        // demo_request(40) + has_company(15) + substantive_message(10) + has_practice(10) + has_region(5)
        $this->assertSame(80, $lead->score);

        Queue::assertPushed(SyncLeadToCrm::class, fn (SyncLeadToCrm $job) => $job->lead->id === $lead->id);
    }

    public function test_a_filled_honeypot_is_rejected(): void
    {
        $response = $this->postJson('/api/v1/leads', [
            'full_name' => 'Bot',
            'email' => 'bot@example.com',
            'form_type' => 'contact',
            'company_website' => 'https://spam.example.com',
        ]);

        $response->assertUnprocessable();
        $this->assertSame(0, Lead::count());
    }

    public function test_a_minimal_submission_with_no_practice_or_region_still_captures(): void
    {
        Queue::fake();

        $this->postJson('/api/v1/leads', [
            'full_name' => 'Sam Lee',
            'email' => 'sam@example.com',
            'form_type' => 'newsletter',
        ])->assertStatus(202);

        $lead = Lead::first();
        $this->assertNull($lead->practice_id);
        $this->assertNull($lead->region_id);
        $this->assertSame(10, $lead->score); // newsletter form_type weight only
    }
}
