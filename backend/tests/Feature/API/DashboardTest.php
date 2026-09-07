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
use Tests\TestCase;

class DashboardTest extends TestCase
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

    public function test_dashboard_requires_authentication(): void
    {
        $this->getJson('/api/v1/admin/dashboard')->assertUnauthorized();
    }

    public function test_any_active_account_can_load_the_dashboard(): void
    {
        $this->actingAs($this->user('editor'))->getJson('/api/v1/admin/dashboard')
            ->assertOk()
            ->assertJsonStructure([
                'data' => [
                    'content' => [['type', 'label', 'draft', 'published', 'archived', 'total']],
                    'totals' => ['published', 'draft', 'media', 'new_leads'],
                    'needs_attention',
                    'recent_activity',
                    'leads' => ['total', 'new', 'last_7_days', 'last_30_days'],
                ],
            ])
            ->assertJsonPath('data.content.0.type', 'practices')
            ->assertJsonPath('data.content.0.published', 7);
    }

    public function test_stale_drafts_surface_in_needs_attention(): void
    {
        Practice::query()->where('slug', 'ai-bees')->update([
            'status' => ContentStatus::Draft->value,
            'updated_at' => now()->subDays(45),
        ]);

        $response = $this->actingAs($this->user('admin'))->getJson('/api/v1/admin/dashboard')->assertOk();

        $reasons = array_column($response->json('data.needs_attention'), 'reason');
        $this->assertContains('stale_draft', $reasons);
    }
}
