<?php

namespace Tests\Feature\API;

use App\Models\User;
use App\Modules\Practice\Models\Practice;
use Database\Seeders\IndustrySeeder;
use Database\Seeders\PracticeSeeder;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Queue;
use Tests\TestCase;

class SeoTest extends TestCase
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

    public function test_editors_can_read_seo_but_only_seo_update_holders_can_write(): void
    {
        $this->actingAs($this->user('editor'))
            ->getJson('/api/v1/admin/seo/practices/ai-bees')
            ->assertOk()
            ->assertJsonStructure(['data' => ['seo', 'warnings']]);

        $this->actingAs($this->user('editor'))
            ->putJson('/api/v1/admin/seo/practices/ai-bees', ['meta_title' => 'AI Bees — Applied AI for the enterprise'])
            ->assertForbidden();

        $this->actingAs($this->user('seo-manager'))
            ->putJson('/api/v1/admin/seo/practices/ai-bees', [
                'meta_title' => 'AI Bees — Applied AI delivery for enterprise teams',
                'meta_description' => str_repeat('Practical AI delivery. ', 6),
            ])
            ->assertOk();

        $this->assertDatabaseHas('seo_metadata', [
            'seoable_type' => 'practice',
            'seoable_id' => Practice::where('slug', 'ai-bees')->value('id'),
            'meta_title' => 'AI Bees — Applied AI delivery for enterprise teams',
        ]);
    }

    public function test_lint_flags_missing_metadata(): void
    {
        $warnings = $this->actingAs($this->user('seo-manager'))
            ->getJson('/api/v1/admin/seo/practices/ai-bees')
            ->json('data.warnings');

        $fields = array_column($warnings, 'field');
        $this->assertContains('meta_title', $fields);
        $this->assertContains('meta_description', $fields);
    }

    public function test_issues_endpoint_lists_published_entities_with_warnings(): void
    {
        $response = $this->actingAs($this->user('seo-manager'))
            ->getJson('/api/v1/admin/seo/issues')
            ->assertOk();

        // The seeded practices are published and have no SEO metadata yet.
        $this->assertNotEmpty($response->json('data'));
        $this->assertContains('practices', array_column($response->json('data'), 'type'));
    }

    public function test_unknown_type_is_404(): void
    {
        $this->actingAs($this->user('seo-manager'))
            ->getJson('/api/v1/admin/seo/widgets/foo')
            ->assertNotFound();
    }
}
