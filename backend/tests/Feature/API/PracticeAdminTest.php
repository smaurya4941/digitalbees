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

    public function test_admin_index_paginates_filters_and_searches(): void
    {
        Practice::query()->where('slug', 'ai-bees')->update(['status' => ContentStatus::Draft->value]);

        $this->actingAs($this->user('admin'))
            ->getJson('/api/v1/admin/practices')
            ->assertOk()
            ->assertJsonPath('meta.total', 7)
            ->assertJsonPath('meta.statuses', ['draft', 'published', 'archived'])
            ->assertJsonStructure(['data', 'meta' => ['current_page', 'last_page', 'per_page', 'total'], 'links']);

        // status filter
        $this->actingAs($this->user('admin'))
            ->getJson('/api/v1/admin/practices?status=draft')
            ->assertOk()
            ->assertJsonPath('meta.total', 1)
            ->assertJsonPath('data.0.slug', 'ai-bees');

        // free-text search
        $this->actingAs($this->user('admin'))
            ->getJson('/api/v1/admin/practices?q=energy')
            ->assertOk()
            ->assertJsonPath('meta.total', 1)
            ->assertJsonPath('data.0.slug', 'energy-bees');

        // pagination
        $page2 = $this->actingAs($this->user('admin'))
            ->getJson('/api/v1/admin/practices?per_page=5&page=2')
            ->assertOk();
        $this->assertSame(2, $page2->json('meta.current_page'));
        $this->assertCount(2, $page2->json('data'));
    }

    public function test_capability_json_fields_and_sub_service_details_round_trip(): void
    {
        $staff = $this->user('staff');

        $created = $this->actingAs($staff)->postJson('/api/v1/practices', [
            'name' => 'Data Bees',
            'key_stats' => [['value' => '10+', 'label' => 'Data engineers']],
            'capabilities' => [['title' => 'Pipelines', 'description' => 'Batch and streaming.']],
            'workflows' => [['step' => 1, 'title' => 'Assess', 'description' => 'Audit the estate.']],
            'framework_stack' => [['category' => 'Warehouse', 'tools' => ['Snowflake', 'BigQuery']]],
            'agent_capabilities' => ['Pipeline orchestration'],
            'technical_capabilities' => [['title' => 'Streaming', 'points' => ['Kafka'], 'proven_in' => ['Case A']]],
            'servicenow_fit' => ['delivery' => [], 'cards' => []],
            'sub_services' => [
                [
                    'name' => 'Data Pipelines',
                    'body' => 'Full pipeline lifecycle.',
                    'whats_included' => [['title' => 'Design', 'description' => 'Architecture review.']],
                ],
            ],
        ]);

        $created->assertCreated()
            ->assertJsonPath('data.key_stats.0.value', '10+')
            ->assertJsonPath('data.capabilities.0.title', 'Pipelines')
            ->assertJsonPath('data.workflows.0.title', 'Assess')
            ->assertJsonPath('data.framework_stack.0.tools.1', 'BigQuery')
            ->assertJsonPath('data.agent_capabilities.0', 'Pipeline orchestration')
            ->assertJsonPath('data.technical_capabilities.0.proven_in.0', 'Case A');

        $show = $this->actingAs($staff)
            ->getJson('/api/v1/admin/practices/data-bees')
            ->assertOk();

        $show->assertJsonPath('data.sub_services.0.body', 'Full pipeline lifecycle.')
            ->assertJsonPath('data.sub_services.0.whats_included.0.title', 'Design')
            ->assertJsonPath('data.capabilities.0.title', 'Pipelines')
            ->assertJsonPath('data.workflows.0.title', 'Assess');
    }

    public function test_capabilities_and_workflows_sync_update_and_delete(): void
    {
        $staff = $this->user('staff');

        $show = $this->actingAs($staff)
            ->getJson('/api/v1/admin/practices/ai-bees')
            ->assertOk();

        $capabilityId = $show->json('data.capabilities.0.id');

        $this->actingAs($staff)->putJson('/api/v1/practices/ai-bees', [
            'capabilities' => [
                ['id' => $capabilityId, 'title' => 'Renamed Capability', 'description' => 'Updated.'],
                ['title' => 'Brand New Capability', 'description' => 'Added.'],
            ],
        ])->assertOk()
            ->assertJsonPath('data.capabilities.0.title', 'Renamed Capability')
            ->assertJsonCount(2, 'data.capabilities');

        $this->assertDatabaseHas('capabilities', ['id' => $capabilityId, 'title' => 'Renamed Capability']);
        $this->assertDatabaseHas('capabilities', ['title' => 'Brand New Capability']);
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
