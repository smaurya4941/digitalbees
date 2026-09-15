<?php

namespace Tests\Feature\Leads;

use App\Modules\Lead\Models\NewsletterSubscriber;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class NewsletterTest extends TestCase
{
    use RefreshDatabase;

    public function test_a_valid_email_subscribes(): void
    {
        $this->postJson('/api/v1/newsletter', ['email' => 'reader@example.com'])
            ->assertStatus(202)
            ->assertJsonPath('data.status', 'success');

        $this->assertDatabaseHas('newsletter_subscribers', [
            'email' => 'reader@example.com',
            'status' => 'subscribed',
        ]);
    }

    public function test_resubscribing_the_same_email_does_not_duplicate(): void
    {
        $this->postJson('/api/v1/newsletter', ['email' => 'reader@example.com'])->assertStatus(202);
        $this->postJson('/api/v1/newsletter', ['email' => 'reader@example.com'])->assertStatus(202);

        $this->assertSame(1, NewsletterSubscriber::where('email', 'reader@example.com')->count());
    }

    public function test_a_filled_honeypot_is_rejected(): void
    {
        $this->postJson('/api/v1/newsletter', [
            'email' => 'bot@example.com',
            'company_website' => 'https://spam.example.com',
        ])->assertUnprocessable();

        $this->assertDatabaseMissing('newsletter_subscribers', ['email' => 'bot@example.com']);
    }

    public function test_an_invalid_email_is_rejected(): void
    {
        $this->postJson('/api/v1/newsletter', ['email' => 'not-an-email'])->assertUnprocessable();
    }
}
