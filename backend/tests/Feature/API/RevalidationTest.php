<?php

namespace Tests\Feature\API;

use App\Jobs\NotifyFrontendRevalidate;
use App\Models\User;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Queue;
use Tests\TestCase;

class RevalidationTest extends TestCase
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

    public function test_content_publish_holders_can_trigger_a_targeted_revalidation(): void
    {
        $this->actingAs($this->user('staff'))->postJson('/api/v1/admin/revalidate', [
            'tags' => ['practices', 'practice:ai-bees'],
        ])->assertAccepted();

        Queue::assertPushed(
            NotifyFrontendRevalidate::class,
            fn (NotifyFrontendRevalidate $job) => $job->tags === ['practices', 'practice:ai-bees'],
        );
    }

    public function test_editors_cannot_trigger_revalidation(): void
    {
        $this->actingAs($this->user('editor'))->postJson('/api/v1/admin/revalidate', ['all' => true])
            ->assertForbidden();
    }

    public function test_all_true_purges_the_broad_tag_set(): void
    {
        $this->actingAs($this->user('admin'))->postJson('/api/v1/admin/revalidate', ['all' => true])
            ->assertAccepted();

        Queue::assertPushed(
            NotifyFrontendRevalidate::class,
            fn (NotifyFrontendRevalidate $job) => in_array('navigation', $job->tags, true)
                && in_array('careers', $job->tags, true),
        );
    }

    public function test_an_empty_request_is_rejected(): void
    {
        $this->actingAs($this->user('admin'))->postJson('/api/v1/admin/revalidate', [])
            ->assertStatus(422);
    }
}
