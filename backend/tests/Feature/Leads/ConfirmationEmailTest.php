<?php

namespace Tests\Feature\Leads;

use App\Mail\JobApplicationConfirmationMail;
use App\Mail\LeadConfirmationMail;
use App\Modules\Career\Models\JobPosting;
use Database\Seeders\PracticeSeeder;
use Database\Seeders\RegionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

/**
 * Blueprint §28.3: every form submission is followed by a transactional
 * confirmation email whose copy mirrors the on-screen confirmation.
 */
class ConfirmationEmailTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed([PracticeSeeder::class, RegionSeeder::class]);
        Mail::fake();
    }

    public function test_a_consultation_lead_queues_a_persona_specific_confirmation(): void
    {
        $this->postJson('/api/v1/leads', [
            'full_name' => 'Jamie Rivera',
            'email' => 'jamie@example.com',
            'form_type' => 'demo_request',
            'persona' => 'delivery',
            'practice_slug' => 'ai-bees',
        ])->assertStatus(202);

        Mail::assertQueued(LeadConfirmationMail::class, function (LeadConfirmationMail $mail) {
            return $mail->hasTo('jamie@example.com')
                && $mail->commitment() === 'Practice Director outreach within 4 business hours';
        });
    }

    public function test_the_email_body_renders_name_and_commitment(): void
    {
        $this->postJson('/api/v1/leads', [
            'full_name' => 'Jamie Rivera',
            'email' => 'jamie@example.com',
            'form_type' => 'demo_request',
            'persona' => 'hire',
            'practice_slug' => 'ai-bees',
        ])->assertStatus(202);

        Mail::assertQueued(LeadConfirmationMail::class, function (LeadConfirmationMail $mail) {
            $mail->assertSeeInHtml('Hi Jamie');
            $mail->assertSeeInHtml('Shortlist overview delivered within 1 business day');
            $mail->assertSeeInText('Shortlist overview delivered within 1 business day');

            return true;
        });
    }

    public function test_newsletter_and_chatbot_leads_do_not_get_a_confirmation(): void
    {
        foreach (['newsletter', 'chatbot'] as $type) {
            $this->postJson('/api/v1/leads', [
                'full_name' => 'Sam',
                'email' => "sam-{$type}@example.com",
                'form_type' => $type,
            ])->assertStatus(202);
        }

        Mail::assertNothingQueued();
    }

    public function test_an_unknown_persona_is_rejected(): void
    {
        $this->postJson('/api/v1/leads', [
            'full_name' => 'Sam',
            'email' => 'sam@example.com',
            'form_type' => 'contact',
            'persona' => 'hacker',
        ])->assertStatus(422);
    }

    public function test_a_job_application_queues_a_confirmation_naming_the_role(): void
    {
        JobPosting::create([
            'title' => 'Senior ML Engineer',
            'slug' => 'senior-ml-engineer',
            'employment_type' => 'full_time',
            'description' => 'Build production ML systems.',
            'status' => 'open',
            'posted_at' => now(),
        ]);

        $this->postJson('/api/v1/careers/senior-ml-engineer/apply', [
            'full_name' => 'Priya Nair',
            'email' => 'priya@example.com',
        ])->assertStatus(202);

        Mail::assertQueued(JobApplicationConfirmationMail::class, function (JobApplicationConfirmationMail $mail) {
            $mail->assertSeeInHtml('Senior ML Engineer');
            $mail->assertSeeInHtml('within 5 business days');

            return $mail->hasTo('priya@example.com');
        });
    }
}
