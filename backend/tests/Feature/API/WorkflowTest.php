<?php

namespace Tests\Feature\API;

use App\Jobs\NotifyFrontendRevalidate;
use App\Models\User;
use App\Modules\Practice\Models\Practice;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Queue;
use Tests\TestCase;

class WorkflowTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Queue::fake();
        $this->seed(RoleSeeder::class);
    }

    private function user(string $role): User
    {
        $user = User::factory()->create();
        $user->syncRoles([$role]);

        return $user;
    }

    private function practice(string $workflow = 'draft', string $status = 'draft'): Practice
    {
        return Practice::create([
            'name' => 'AI Bees',
            'slug' => 'ai-bees',
            'tagline' => 'Applied AI.',
            'summary' => 'AI delivery.',
            'status' => $status,
            'workflow_state' => $workflow,
            'sort_order' => 1,
        ]);
    }

    private function transition(User $actor, string $to, array $extra = [])
    {
        return $this->actingAs($actor)->postJson(
            '/api/v1/admin/practices/ai-bees/transition',
            [...['to' => $to], ...$extra],
        );
    }

    public function test_transition_and_queue_require_authentication(): void
    {
        $this->practice();

        $this->postJson('/api/v1/admin/practices/ai-bees/transition', ['to' => 'in_review'])->assertUnauthorized();
        $this->getJson('/api/v1/admin/workflow/queue')->assertUnauthorized();
    }

    public function test_new_content_inherits_workflow_state_from_status(): void
    {
        // No workflow_state passed (as seeders / services do) — derived from status.
        $published = Practice::create([
            'name' => 'Quality Bees', 'slug' => 'quality-bees',
            'status' => 'published', 'sort_order' => 2,
        ]);

        $this->assertSame('published', $published->fresh()->workflow_state->value);
    }

    public function test_editor_submits_for_review_but_cannot_approve(): void
    {
        $this->practice();
        $editor = $this->user('editor');

        $this->transition($editor, 'in_review')
            ->assertOk()
            ->assertJsonPath('data.workflow_state', 'in_review');

        $this->assertDatabaseHas('content_reviews', [
            'reviewable_type' => 'practice',
            'action' => 'submitted',
            'to_state' => 'in_review',
        ]);

        $this->transition($editor, 'approved')->assertForbidden();
    }

    public function test_reviewer_approves_then_publishes_and_the_site_is_revalidated(): void
    {
        $this->practice(workflow: 'in_review');
        $reviewer = $this->user('reviewer');

        $this->transition($reviewer, 'approved')->assertOk();
        Queue::assertPushed(NotifyFrontendRevalidate::class);

        $publish = $this->transition($reviewer, 'published')->assertOk();
        $publish->assertJsonPath('data.workflow_state', 'published')
            ->assertJsonPath('data.status', 'published');

        $this->assertDatabaseHas('audit_logs', ['auditable_type' => 'practice', 'action' => 'workflow:published']);
        $this->getJson('/api/v1/practices/ai-bees')->assertOk();
    }

    public function test_rejecting_from_review_requires_a_note(): void
    {
        $this->practice(workflow: 'in_review');
        $reviewer = $this->user('reviewer');

        $this->transition($reviewer, 'draft')->assertStatus(422);

        $this->transition($reviewer, 'draft', ['notes' => 'Needs a stronger opening.'])
            ->assertOk()
            ->assertJsonPath('data.workflow_state', 'draft');

        $this->assertDatabaseHas('content_reviews', [
            'action' => 'rejected',
            'notes' => 'Needs a stronger opening.',
        ]);
    }

    public function test_an_invalid_transition_is_rejected(): void
    {
        $this->practice();

        $this->transition($this->user('admin'), 'approved')->assertStatus(422);
    }

    public function test_scheduling_needs_a_future_date_and_does_not_publish_yet(): void
    {
        $this->practice(workflow: 'approved');
        $admin = $this->user('admin');

        $this->transition($admin, 'scheduled', ['scheduled_for' => now()->subHour()->toIso8601String()])
            ->assertStatus(422);

        $this->transition($admin, 'scheduled', ['scheduled_for' => now()->addDay()->toIso8601String()])
            ->assertOk()
            ->assertJsonPath('data.workflow_state', 'scheduled')
            ->assertJsonPath('data.status', 'draft');

        $this->getJson('/api/v1/practices/ai-bees')->assertNotFound();
    }

    public function test_the_scheduler_publishes_content_whose_time_has_passed(): void
    {
        $practice = $this->practice(workflow: 'approved');
        $this->transition($this->user('admin'), 'scheduled', [
            'scheduled_for' => now()->addMinutes(5)->toIso8601String(),
        ])->assertOk();

        $this->artisan('content:publish-scheduled')->assertSuccessful();
        $this->assertSame('scheduled', $practice->fresh()->workflow_state->value);

        $this->travel(10)->minutes();

        $this->artisan('content:publish-scheduled')->assertSuccessful();
        $this->assertSame('published', $practice->fresh()->workflow_state->value);
        $this->assertSame('published', $practice->fresh()->status->value);
    }

    public function test_queue_lists_in_review_content_and_is_gated(): void
    {
        $this->practice(workflow: 'in_review');

        $this->actingAs($this->user('editor'))->getJson('/api/v1/admin/workflow/queue')->assertForbidden();

        $this->actingAs($this->user('reviewer'))->getJson('/api/v1/admin/workflow/queue')
            ->assertOk()
            ->assertJsonPath('data.0.type', 'practices')
            ->assertJsonPath('data.0.slug', 'ai-bees');
    }

    public function test_workflow_show_reports_only_permitted_transitions(): void
    {
        $this->practice();

        $editor = $this->actingAs($this->user('editor'))
            ->getJson('/api/v1/admin/practices/ai-bees/workflow')
            ->assertOk();

        $states = array_column($editor->json('data.allowed_transitions'), 'to');
        $this->assertContains('in_review', $states);   // has content.review
        $this->assertNotContains('published', $states); // lacks content.publish
    }

    public function test_direct_status_publish_still_works_and_advances_the_workflow(): void
    {
        $this->practice();

        $this->actingAs($this->user('admin'))
            ->putJson('/api/v1/practices/ai-bees', ['status' => 'published'])
            ->assertOk();

        $fresh = Practice::where('slug', 'ai-bees')->first();
        $this->assertSame('published', $fresh->status->value);
        $this->assertSame('published', $fresh->workflow_state->value);
    }
}
