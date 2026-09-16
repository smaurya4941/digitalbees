<?php

namespace Tests\Feature\API;

use App\Models\User;
use App\Modules\Testimonial\Models\Testimonial;
use Database\Seeders\RoleSeeder;
use Database\Seeders\TestimonialSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Queue;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class TestimonialAdminTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Queue::fake();
        $this->seed([RoleSeeder::class, TestimonialSeeder::class]);
    }

    private function user(string $role): User
    {
        $user = User::factory()->create();
        $user->syncRoles([$role]);

        return $user;
    }

    public function test_writes_require_authentication(): void
    {
        $this->postJson('/api/v1/testimonials', ['quote' => 'X'])->assertUnauthorized();
        $this->getJson('/api/v1/admin/testimonials')->assertUnauthorized();
    }

    public function test_staff_can_create_and_update_a_testimonial(): void
    {
        $staff = $this->user('staff');

        $created = $this->actingAs($staff)->postJson('/api/v1/testimonials', [
            'quote' => 'TeamBees shipped our AI agent faster than we thought possible.',
            'author_title' => 'VP Engineering',
            'author_company' => 'A growth-stage SaaS company',
            'related_type' => 'ai-bees',
        ]);

        $created->assertCreated()
            ->assertJsonPath('data.status', 'draft')
            ->assertJsonPath('data.related_type', 'ai-bees');

        $id = $created->json('data.id');

        $this->actingAs($staff)->putJson("/api/v1/testimonials/{$id}", [
            'author_title' => 'CTO',
        ])->assertOk()->assertJsonPath('data.author_title', 'CTO');
    }

    public function test_staff_without_publish_permission_cannot_publish(): void
    {
        Role::findByName('staff')->revokePermissionTo('content.publish');
        app(\Spatie\Permission\PermissionRegistrar::class)->forgetCachedPermissions();

        $staff = $this->user('staff');

        $created = $this->actingAs($staff)->postJson('/api/v1/testimonials', [
            'quote' => 'A draft-only quote.',
        ])->assertCreated();

        $this->actingAs($staff)
            ->putJson("/api/v1/testimonials/{$created->json('data.id')}", ['status' => 'published'])
            ->assertForbidden();
    }

    public function test_staff_cannot_delete_but_admin_can(): void
    {
        $testimonial = Testimonial::query()->first();

        $this->actingAs($this->user('staff'))
            ->deleteJson("/api/v1/testimonials/{$testimonial->id}")
            ->assertForbidden();

        $this->assertDatabaseHas('testimonials', ['id' => $testimonial->id]);

        $this->actingAs($this->user('admin'))
            ->deleteJson("/api/v1/testimonials/{$testimonial->id}")
            ->assertOk();

        $this->assertDatabaseMissing('testimonials', ['id' => $testimonial->id]);
    }

    public function test_admin_index_paginates_filters_and_searches(): void
    {
        $this->actingAs($this->user('admin'))
            ->getJson('/api/v1/admin/testimonials')
            ->assertOk()
            ->assertJsonPath('meta.total', 3)
            ->assertJsonPath('meta.statuses', ['draft', 'published'])
            ->assertJsonStructure(['data', 'meta' => ['current_page', 'last_page', 'per_page', 'total'], 'links']);

        $this->actingAs($this->user('admin'))
            ->getJson('/api/v1/admin/testimonials?related_type=careers')
            ->assertOk()
            ->assertJsonPath('meta.total', 1);
    }
}
