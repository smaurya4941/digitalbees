<?php

namespace Tests\Feature\API;

use App\Models\User;
use Database\Seeders\IndustrySeeder;
use Database\Seeders\PracticeSeeder;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Queue;
use Tests\TestCase;

class RedirectAdminTest extends TestCase
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

    public function test_redirects_are_gated_and_feed_the_public_endpoint(): void
    {
        $this->actingAs($this->user('staff'))->getJson('/api/v1/admin/redirects')->assertForbidden();

        $this->actingAs($this->user('admin'))->postJson('/api/v1/admin/redirects', [
            'from_path' => '/old-page',
            'to_path' => '/new-page',
        ])->assertCreated();

        $this->getJson('/api/v1/redirects')
            ->assertOk()
            ->assertJsonPath('data.0.from', '/old-page')
            ->assertJsonPath('data.0.status_code', 301);
    }

    public function test_from_path_must_be_absolute_and_not_a_self_loop(): void
    {
        $admin = $this->user('admin');

        $this->actingAs($admin)->postJson('/api/v1/admin/redirects', [
            'from_path' => 'old-page', 'to_path' => '/new',
        ])->assertStatus(422)->assertJsonValidationErrors('from_path');

        $this->actingAs($admin)->postJson('/api/v1/admin/redirects', [
            'from_path' => '/loop', 'to_path' => '/loop',
        ])->assertStatus(422)->assertJsonValidationErrors('to_path');
    }

    public function test_changing_a_content_slug_leaves_a_301_behind(): void
    {
        $this->actingAs($this->user('admin'))->putJson('/api/v1/practices/ai-bees', [
            'slug' => 'artificial-intelligence-bees',
        ])->assertOk();

        $this->assertDatabaseHas('redirects', [
            'from_path' => '/practices/ai-bees',
            'to_path' => '/practices/artificial-intelligence-bees',
            'status_code' => 301,
        ]);
    }
}
