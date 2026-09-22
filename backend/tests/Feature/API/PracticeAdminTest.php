<?php

namespace Tests\Feature\API;

use App\Models\User;
use App\Modules\Industry\Models\Industry;
use App\Modules\Practice\Models\Practice;
use App\Modules\Region\Models\Region;
use App\Modules\Technology\Models\Technology;
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

    public function test_relations_round_trip_and_drive_the_public_detail(): void
    {
        $admin = $this->user('admin');
        $industry = Industry::query()->where('slug', 'healthcare')->firstOrFail();
        $technology = Technology::query()->create(['name' => 'LangGraph', 'slug' => 'langgraph', 'status' => 'published']);
        $region = Region::query()->create(['name' => 'India', 'slug' => 'india', 'status' => 'published']);

        $this->actingAs($admin)->getJson('/api/v1/admin/practices/relation-options')
            ->assertOk()
            ->assertJsonFragment(['slug' => 'langgraph'])
            ->assertJsonFragment(['slug' => 'india']);

        $this->actingAs($admin)->putJson('/api/v1/practices/ai-bees', [
            'industry_ids' => [$industry->id],
            'technology_ids' => [$technology->id],
            'region_ids' => [$region->id],
        ])->assertOk()
            ->assertJsonPath('data.industry_ids', [$industry->id])
            ->assertJsonPath('data.technology_ids', [$technology->id])
            ->assertJsonPath('data.region_ids', [$region->id]);

        $this->getJson('/api/v1/practices/ai-bees')
            ->assertOk()
            ->assertJsonFragment(['slug' => 'langgraph'])
            ->assertJsonFragment(['slug' => 'india']);

        // An empty list clears that edge type only.
        $this->actingAs($admin)->putJson('/api/v1/practices/ai-bees', ['technology_ids' => []])
            ->assertOk()
            ->assertJsonPath('data.technology_ids', [])
            ->assertJsonPath('data.region_ids', [$region->id]);

        $this->actingAs($admin)->putJson('/api/v1/practices/ai-bees', ['industry_ids' => [999999]])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['industry_ids.0']);
    }

    public function test_deleted_practice_is_hidden_listed_in_trash_and_restorable(): void
    {
        $admin = $this->user('admin');

        $this->actingAs($admin)->deleteJson('/api/v1/practices/ai-bees')->assertOk();
        $this->getJson('/api/v1/practices/ai-bees')->assertNotFound();

        $this->actingAs($admin)->getJson('/api/v1/admin/practices/trash')
            ->assertOk()
            ->assertJsonPath('data.0.slug', 'ai-bees');

        $this->actingAs($this->user('staff'))->postJson('/api/v1/practices/ai-bees/restore')->assertForbidden();

        $this->actingAs($admin)->postJson('/api/v1/practices/ai-bees/restore')
            ->assertOk()
            ->assertJsonPath('data.slug', 'ai-bees');

        $this->getJson('/api/v1/practices/ai-bees')->assertOk();
        $this->actingAs($admin)->getJson('/api/v1/admin/practices/trash')->assertOk()->assertJsonCount(0, 'data');
        $this->actingAs($admin)->postJson('/api/v1/practices/ai-bees/restore')->assertNotFound();
    }

    public function test_sub_service_seo_is_saved_and_returned(): void
    {
        $admin = $this->user('admin');

        $this->actingAs($admin)->putJson('/api/v1/practices/ai-bees', [
            'sub_services' => [[
                'name' => 'Agent Ops',
                'slug' => 'agent-ops',
                'status' => 'published',
                'seo' => ['meta_title' => 'Agent Ops | TeamBees', 'meta_description' => 'Run agents in production.'],
            ]],
        ])->assertOk()
            ->assertJsonPath('data.sub_services.0.slug', 'agent-ops')
            ->assertJsonPath('data.sub_services.0.seo.meta_title', 'Agent Ops | TeamBees');

        $this->getJson('/api/v1/practices/ai-bees/sub-services/agent-ops')
            ->assertOk()
            ->assertJsonPath('data.seo.meta_title', 'Agent Ops | TeamBees');
    }
}
