<?php

namespace Tests\Feature\API;

use App\Models\User;
use App\Modules\Resource\Models\Resource;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Queue;
use Tests\TestCase;

class ResourceAdminTest extends TestCase
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

    private function makeResource(array $overrides = []): Resource
    {
        return Resource::create(array_merge([
            'title' => 'The state of applied AI',
            'slug' => 'state-of-applied-ai',
            'resource_type' => 'blog',
            'excerpt' => 'A field report.',
            'status' => 'published',
            'published_at' => now(),
        ], $overrides));
    }

    public function test_writes_require_authentication(): void
    {
        $this->postJson('/api/v1/resources', ['title' => 'X'])->assertUnauthorized();
        $this->getJson('/api/v1/admin/resources')->assertUnauthorized();
    }

    public function test_staff_can_create_update_and_publish_a_resource(): void
    {
        $staff = $this->user('staff');

        $created = $this->actingAs($staff)->postJson('/api/v1/resources', [
            'title' => 'Building an internal RAG stack',
            'resource_type' => 'guide',
            'excerpt' => 'What we learned.',
        ]);

        $created->assertCreated()
            ->assertJsonPath('data.slug', 'building-an-internal-rag-stack')
            ->assertJsonPath('data.status', 'draft');

        $this->actingAs($staff)->putJson('/api/v1/resources/building-an-internal-rag-stack', [
            'status' => 'published',
        ])->assertOk()->assertJsonPath('data.status', 'published');

        $this->assertNotNull(Resource::where('slug', 'building-an-internal-rag-stack')->value('published_at'));
    }

    public function test_editor_cannot_publish_without_the_permission(): void
    {
        $editor = $this->user('editor'); // holds content.create/update, not content.publish

        $this->actingAs($editor)->postJson('/api/v1/resources', [
            'title' => 'Draft only',
            'resource_type' => 'news',
            'status' => 'published',
        ])->assertForbidden();
    }

    public function test_admin_index_paginates_and_filters_by_type(): void
    {
        $this->makeResource(['slug' => 'a', 'title' => 'A', 'resource_type' => 'blog']);
        $this->makeResource(['slug' => 'b', 'title' => 'B', 'resource_type' => 'guide']);

        $this->actingAs($this->user('admin'))->getJson('/api/v1/admin/resources?type=guide')
            ->assertOk()
            ->assertJsonPath('meta.total', 1)
            ->assertJsonPath('data.0.resource_type', 'guide')
            ->assertJsonStructure(['meta' => ['current_page', 'last_page', 'per_page', 'total', 'types']]);
    }

    public function test_public_feeds_expose_only_published_and_split_insights_from_resources(): void
    {
        $this->makeResource(['slug' => 'live-blog', 'resource_type' => 'blog', 'status' => 'published']);
        $this->makeResource(['slug' => 'draft-blog', 'resource_type' => 'blog', 'status' => 'draft', 'published_at' => null]);
        $this->makeResource(['slug' => 'a-guide', 'resource_type' => 'guide', 'status' => 'published']);

        $insights = $this->getJson('/api/v1/insights')->assertOk()->json('data');
        $this->assertSame(['live-blog'], array_column($insights, 'slug'));

        $resources = $this->getJson('/api/v1/resources')->assertOk()->json('data');
        $this->assertEqualsCanonicalizing(['live-blog', 'a-guide'], array_column($resources, 'slug'));

        $this->getJson('/api/v1/insights/a-guide')->assertNotFound();
        $this->getJson('/api/v1/resources/a-guide')->assertOk()->assertJsonPath('data.body', null);
    }

    public function test_status_lifecycle_endpoint_covers_resources(): void
    {
        $this->makeResource(['slug' => 'to-archive']);

        $this->actingAs($this->user('admin'))
            ->patchJson('/api/v1/admin/content/resources/to-archive/status', ['status' => 'archived'])
            ->assertOk()
            ->assertJsonPath('data.status', 'archived');
    }
}
