<?php

namespace Tests\Feature\API;

use App\Models\User;
use App\Modules\Practice\Models\Practice;
use App\Support\Enums\ContentStatus;
use Database\Seeders\IndustrySeeder;
use Database\Seeders\PracticeSeeder;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Queue;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class PracticeAdminTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Queue::fake();
        $this->seed([RoleSeeder::class, PracticeSeeder::class, IndustrySeeder::class]);
    }

    private function user(string $role): User
    {
        $user = User::factory()->create();
        $user->syncRoles([$role]);

        return $user;
    }

    public function test_writes_require_authentication(): void
    {
        $this->postJson('/api/v1/practices', ['name' => 'X'])->assertUnauthorized();
        $this->putJson('/api/v1/practices/ai-bees', ['name' => 'X'])->assertUnauthorized();
        $this->deleteJson('/api/v1/practices/ai-bees')->assertUnauthorized();
        $this->getJson('/api/v1/admin/practices')->assertUnauthorized();
    }

    public function test_staff_can_create_and_update_content(): void
    {
        $staff = $this->user('staff');

        $created = $this->actingAs($staff)->postJson('/api/v1/practices', [
            'name' => 'Cloud Bees',
            'tagline' => 'Cloud platform delivery.',
            'summary' => 'FinOps and platform engineering.',
        ]);

        $created->assertCreated()
            ->assertJsonPath('data.slug', 'cloud-bees')
            ->assertJsonPath('data.status', 'draft');

        $this->actingAs($staff)->putJson('/api/v1/practices/cloud-bees', [
            'tagline' => 'Updated tagline.',
        ])->assertOk()->assertJsonPath('data.tagline', 'Updated tagline.');
    }

    public function test_staff_can_publish_because_they_hold_content_publish(): void
    {
        $staff = $this->user('staff');

        $this->actingAs($staff)->putJson('/api/v1/practices/ai-bees', [
            'status' => 'archived',
        ])->assertOk()->assertJsonPath('data.status', 'archived');
    }

    public function test_a_staff_role_without_publish_permission_cannot_change_published_state(): void
    {
        // Simulate the client asking us to tighten staff: "staff can edit blogs
        // but not publish" — a permission-assignment change, not a code change.
        Role::findByName('staff')->revokePermissionTo('content.publish');
        app(\Spatie\Permission\PermissionRegistrar::class)->forgetCachedPermissions();

        $staff = $this->user('staff');

        // Editing a draft field is still fine.
        $this->actingAs($staff)->postJson('/api/v1/practices', ['name' => 'Draft Bees'])
            ->assertCreated();

        // Flipping status to/from published is not.
        $this->actingAs($staff)->putJson('/api/v1/practices/ai-bees', ['status' => 'draft'])
            ->assertForbidden();
    }

    public function test_staff_cannot_delete_but_admin_can(): void
    {
        $this->actingAs($this->user('staff'))
            ->deleteJson('/api/v1/practices/energy-bees')
            ->assertForbidden();

        $this->assertDatabaseHas('practices', ['slug' => 'energy-bees', 'deleted_at' => null]);

        $this->actingAs($this->user('admin'))
            ->deleteJson('/api/v1/practices/energy-bees')
            ->assertOk();

        $this->assertSoftDeleted('practices', ['slug' => 'energy-bees']);
    }

    public function test_admin_index_lists_every_status(): void
    {
        Practice::query()->where('slug', 'ai-bees')->update(['status' => ContentStatus::Draft->value]);

        $this->actingAs($this->user('admin'))
            ->getJson('/api/v1/admin/practices')
            ->assertOk()
            ->assertJsonPath('meta.count', 7)
            ->assertJsonPath('meta.statuses', ['draft', 'published', 'archived']);
    }

    public function test_cross_taxonomy_status_endpoint_is_permission_gated(): void
    {
        Role::findByName('staff')->revokePermissionTo('content.publish');
        app(\Spatie\Permission\PermissionRegistrar::class)->forgetCachedPermissions();

        $this->actingAs($this->user('staff'))
            ->patchJson('/api/v1/admin/content/industries/healthcare/status', ['status' => 'draft'])
            ->assertForbidden();

        $this->actingAs($this->user('admin'))
            ->patchJson('/api/v1/admin/content/industries/healthcare/status', ['status' => 'draft'])
            ->assertOk();

        $this->getJson('/api/v1/industries/healthcare')->assertNotFound();
    }
}
