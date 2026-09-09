<?php

namespace Tests\Feature\API;

use App\Jobs\NotifyFrontendRevalidate;
use App\Models\User;
use App\Modules\Practice\Models\Practice;
use App\Support\Models\ContentRevision;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Queue;
use Spatie\Permission\PermissionRegistrar;
use Tests\TestCase;

class RevisionTest extends TestCase
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

    private function practice(array $overrides = []): Practice
    {
        // Direct create() — no acting user — so this does NOT get versioned.
        return Practice::create(array_merge([
            'name' => 'AI Bees',
            'slug' => 'ai-bees',
            'tagline' => 'Applied AI.',
            'summary' => 'AI delivery.',
            'status' => 'published',
            'sort_order' => 1,
        ], $overrides));
    }

    public function test_history_endpoints_require_authentication(): void
    {
        $this->practice();

        $this->getJson('/api/v1/admin/practices/ai-bees/revisions')->assertUnauthorized();
    }

    public function test_seeding_and_system_writes_are_not_versioned(): void
    {
        $practice = $this->practice();

        $this->assertSame(0, $practice->revisions()->count());
    }

    public function test_an_authenticated_edit_records_a_revision_with_its_author(): void
    {
        $practice = $this->practice();
        $staff = $this->user('staff');

        $this->actingAs($staff)
            ->putJson('/api/v1/practices/ai-bees', ['tagline' => 'Applied AI, in production.'])
            ->assertOk();

        $revision = $practice->revisions()->latest('id')->first();

        $this->assertNotNull($revision);
        $this->assertSame($staff->id, $revision->author_id);
        $this->assertSame('Applied AI, in production.', $revision->data['tagline']);
        $this->assertArrayHasKey('_seo', $revision->data);
    }

    public function test_history_list_reports_changed_fields_between_versions(): void
    {
        $this->practice();
        $admin = $this->user('admin');

        $this->actingAs($admin)->putJson('/api/v1/practices/ai-bees', ['tagline' => 'v2'])->assertOk();
        $this->actingAs($admin)->putJson('/api/v1/practices/ai-bees', ['summary' => 'v2 summary'])->assertOk();

        $response = $this->actingAs($admin)
            ->getJson('/api/v1/admin/practices/ai-bees/revisions')
            ->assertOk();

        $this->assertCount(2, $response->json('data'));
        // Newest first: the latest revision changed `summary` (only) vs the previous one.
        $this->assertSame(['summary'], $response->json('data.0.changed_fields'));
        $this->assertNotNull($response->json('data.0.author.name'));
    }

    public function test_restore_reverts_fields_records_a_revision_and_revalidates(): void
    {
        $this->practice();
        $admin = $this->user('admin');

        $this->actingAs($admin)->putJson('/api/v1/practices/ai-bees', ['tagline' => 'first edit'])->assertOk();
        $original = Practice::where('slug', 'ai-bees')->first()->revisions()->latest('id')->first();

        $this->actingAs($admin)->putJson('/api/v1/practices/ai-bees', ['tagline' => 'second edit'])->assertOk();
        $this->assertSame('second edit', Practice::where('slug', 'ai-bees')->value('tagline'));

        Queue::fake();

        $this->actingAs($admin)
            ->postJson("/api/v1/admin/practices/ai-bees/revisions/{$original->id}/restore")
            ->assertOk()
            ->assertJsonPath('data.restored_from', $original->id);

        $this->assertSame('first edit', Practice::where('slug', 'ai-bees')->value('tagline'));
        Queue::assertPushed(NotifyFrontendRevalidate::class);
        $this->assertDatabaseHas('audit_logs', [
            'auditable_type' => 'practice',
            'action' => 'reverted',
        ]);
        // The restore save is itself versioned.
        $this->assertSame('first edit', Practice::where('slug', 'ai-bees')->first()
            ->revisions()->latest('id')->first()->data['tagline']);
    }

    public function test_restoring_a_published_state_change_needs_content_publish(): void
    {
        $this->practice(['status' => 'published']);
        $admin = $this->user('admin');

        // Draft snapshot created by an admin edit.
        $this->actingAs($admin)->putJson('/api/v1/practices/ai-bees', ['status' => 'draft'])->assertOk();
        $draftRevision = Practice::where('slug', 'ai-bees')->first()->revisions()->latest('id')->first();

        $this->actingAs($admin)->putJson('/api/v1/practices/ai-bees', ['status' => 'published'])->assertOk();

        // editor holds content.update but not content.publish.
        $this->actingAs($this->user('editor'))
            ->postJson("/api/v1/admin/practices/ai-bees/revisions/{$draftRevision->id}/restore")
            ->assertForbidden();

        $this->assertSame('published', Practice::where('slug', 'ai-bees')->first()->status->value);
    }

    public function test_a_revision_from_another_entity_cannot_be_restored(): void
    {
        $this->practice();
        $other = $this->practice(['name' => 'Quality Bees', 'slug' => 'quality-bees']);
        $admin = $this->user('admin');

        $this->actingAs($admin)->putJson('/api/v1/practices/quality-bees', ['tagline' => 'x'])->assertOk();
        $foreign = $other->revisions()->latest('id')->first();

        $this->actingAs($admin)
            ->postJson("/api/v1/admin/practices/ai-bees/revisions/{$foreign->id}/restore")
            ->assertNotFound();
    }

    public function test_revisions_are_pruned_to_the_retention_limit(): void
    {
        config()->set('revisions.keep', 3);

        $this->practice();
        $admin = $this->user('admin');

        foreach (range(1, 6) as $i) {
            $this->actingAs($admin)->putJson('/api/v1/practices/ai-bees', ['tagline' => "v{$i}"])->assertOk();
        }

        $this->assertSame(3, Practice::where('slug', 'ai-bees')->first()->revisions()->count());
        $this->assertSame(3, ContentRevision::count());
    }

    public function test_editor_can_view_history_but_seo_manager_style_role_without_content_update_cannot(): void
    {
        $this->practice();

        $this->actingAs($this->user('editor'))
            ->getJson('/api/v1/admin/practices/ai-bees/revisions')
            ->assertOk();

        $this->actingAs($this->user('seo-manager'))
            ->getJson('/api/v1/admin/practices/ai-bees/revisions')
            ->assertOk(); // seo-manager holds content.update per RoleSeeder

        app(PermissionRegistrar::class)->forgetCachedPermissions();
    }
}
