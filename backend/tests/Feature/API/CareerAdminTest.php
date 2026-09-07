<?php

namespace Tests\Feature\API;

use App\Models\User;
use App\Modules\Career\Models\JobPosting;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Queue;
use Tests\TestCase;

class CareerAdminTest extends TestCase
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

    private function job(array $overrides = []): JobPosting
    {
        return JobPosting::create(array_merge([
            'title' => 'Senior ML Engineer',
            'slug' => 'senior-ml-engineer',
            'employment_type' => 'full_time',
            'description' => 'Build production ML systems.',
            'status' => 'open',
            'posted_at' => now(),
        ], $overrides));
    }

    public function test_writes_require_authentication(): void
    {
        $this->postJson('/api/v1/careers', ['title' => 'X'])->assertUnauthorized();
        $this->getJson('/api/v1/admin/careers')->assertUnauthorized();
    }

    public function test_staff_can_create_update_and_open_a_role(): void
    {
        $staff = $this->user('staff');

        $created = $this->actingAs($staff)->postJson('/api/v1/careers', [
            'title' => 'Platform Engineer',
            'employment_type' => 'contract',
        ]);

        $created->assertCreated()
            ->assertJsonPath('data.slug', 'platform-engineer')
            ->assertJsonPath('data.status', 'draft');

        $this->actingAs($staff)->putJson('/api/v1/careers/platform-engineer', ['status' => 'open'])
            ->assertOk()
            ->assertJsonPath('data.status', 'open');

        $this->assertNotNull(JobPosting::where('slug', 'platform-engineer')->value('posted_at'));
    }

    public function test_editor_cannot_open_a_role(): void
    {
        $this->actingAs($this->user('editor'))->postJson('/api/v1/careers', [
            'title' => 'Draft role',
            'employment_type' => 'full_time',
            'status' => 'open',
        ])->assertForbidden();
    }

    public function test_admin_index_paginates_and_filters_by_status(): void
    {
        $this->job(['slug' => 'a', 'title' => 'A', 'status' => 'open']);
        $this->job(['slug' => 'b', 'title' => 'B', 'status' => 'draft', 'posted_at' => null]);

        $this->actingAs($this->user('admin'))->getJson('/api/v1/admin/careers?status=draft')
            ->assertOk()
            ->assertJsonPath('meta.total', 1)
            ->assertJsonPath('data.0.slug', 'b')
            ->assertJsonStructure(['meta' => ['statuses']]);
    }

    public function test_public_feed_shows_only_open_roles(): void
    {
        $this->job(['slug' => 'live', 'status' => 'open']);
        $this->job(['slug' => 'hidden', 'status' => 'draft', 'posted_at' => null]);

        $roles = $this->getJson('/api/v1/careers')->assertOk()->json('data');
        $this->assertSame(['live'], array_column($roles, 'slug'));

        $this->getJson('/api/v1/careers/hidden')->assertNotFound();
        $this->getJson('/api/v1/careers/live')->assertOk()->assertJsonPath('data.description', 'Build production ML systems.');
    }

    public function test_candidates_can_apply_and_the_honeypot_is_enforced(): void
    {
        $job = $this->job(['slug' => 'apply-here', 'status' => 'open']);

        $this->postJson('/api/v1/careers/apply-here/apply', [
            'full_name' => 'Dana Lee',
            'email' => 'dana@example.com',
            'company_website' => 'http://spam.example',
        ])->assertStatus(422);

        $this->postJson('/api/v1/careers/apply-here/apply', [
            'full_name' => 'Dana Lee',
            'email' => 'dana@example.com',
            'cover_note' => 'Keen to help.',
        ])->assertAccepted();

        $this->assertDatabaseHas('job_applications', ['job_id' => $job->id, 'email' => 'dana@example.com']);

        $this->actingAs($this->user('admin'))
            ->getJson('/api/v1/admin/careers/apply-here/applications')
            ->assertOk()
            ->assertJsonPath('data.0.email', 'dana@example.com');
    }
}
