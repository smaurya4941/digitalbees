<?php

namespace Tests\Feature\API;

use App\Models\User;
use App\Modules\Practice\Models\Practice;
use App\Support\Enums\ContentStatus;
use Database\Seeders\PracticeSeeder;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Queue;
use Tests\TestCase;

class AdminAuthTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Queue::fake();
        User::updateOrCreate(
            ['email' => 'test@example.com'],
            ['name' => 'Test User', 'password' => bcrypt('password')],
        );
        $this->seed([RoleSeeder::class, PracticeSeeder::class]);
    }

    public function test_login_returns_a_token_and_role(): void
    {
        $response = $this->postJson('/api/v1/auth/login', [
            'email' => 'test@example.com',
            'password' => 'password',
        ]);

        $response->assertOk()
            ->assertJsonStructure(['data' => ['token', 'user' => ['id', 'email', 'roles', 'permissions']]]);

        $this->assertContains('Super Admin', $response->json('data.user.roles'));
    }

    public function test_login_rejects_bad_credentials(): void
    {
        $this->postJson('/api/v1/auth/login', ['email' => 'test@example.com', 'password' => 'wrong'])
            ->assertStatus(422);
    }

    public function test_admin_endpoints_require_authentication(): void
    {
        $this->getJson('/api/v1/admin/practices')->assertUnauthorized();
        $this->patchJson('/api/v1/admin/practices/ai-bees/status', ['status' => 'draft'])->assertUnauthorized();
    }

    public function test_editor_cannot_publish_but_reviewer_can(): void
    {
        $editor = User::factory()->create();
        $editor->assignRole('Editor');

        $this->actingAs($editor, 'sanctum')
            ->patchJson('/api/v1/admin/practices/ai-bees/status', ['status' => 'archived'])
            ->assertForbidden();

        $reviewer = User::factory()->create();
        $reviewer->assignRole('Reviewer');

        $this->actingAs($reviewer, 'sanctum')
            ->patchJson('/api/v1/admin/practices/ai-bees/status', ['status' => 'archived'])
            ->assertOk()
            ->assertJsonPath('data.status', 'archived');

        $this->assertSame(ContentStatus::Archived, Practice::firstWhere('slug', 'ai-bees')->status);
    }

    public function test_super_admin_can_list_and_change_status(): void
    {
        $admin = User::firstWhere('email', 'test@example.com');

        $this->actingAs($admin, 'sanctum')
            ->getJson('/api/v1/admin/practices')
            ->assertOk()
            ->assertJsonPath('meta.count', 7);

        $this->actingAs($admin, 'sanctum')
            ->patchJson('/api/v1/admin/practices/ai-bees/status', ['status' => 'draft'])
            ->assertOk();

        // Draft practice disappears from the public API.
        $this->getJson('/api/v1/practices/ai-bees')->assertNotFound();
    }
}
