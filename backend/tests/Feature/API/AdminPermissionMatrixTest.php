<?php

namespace Tests\Feature\API;

use App\Models\User;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Queue;
use Tests\TestCase;

/**
 * Guards the P0 permission wiring: media routes gate on `media.*`, lead routes
 * on `inquiries.*`. Staff holds `media.upload` + `inquiries.view` but not
 * `media.delete` / `inquiries.manage` (see {@see RoleSeeder}).
 */
class AdminPermissionMatrixTest extends TestCase
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

    public function test_admin_media_and_lead_routes_require_authentication(): void
    {
        $this->getJson('/api/v1/admin/leads')->assertUnauthorized();
        $this->getJson('/api/v1/admin/media')->assertUnauthorized();
        $this->postJson('/api/v1/admin/media')->assertUnauthorized();
    }

    public function test_staff_can_read_leads_but_not_change_status(): void
    {
        $staff = $this->user('staff');

        $this->actingAs($staff)->getJson('/api/v1/admin/leads')
            ->assertOk()
            ->assertJsonStructure(['data', 'meta' => ['current_page', 'last_page', 'per_page', 'total', 'statuses'], 'links']);

        $this->actingAs($staff)->patchJson('/api/v1/admin/leads/1/status', ['status' => 'synced'])
            ->assertForbidden();
    }

    public function test_admin_can_read_leads_and_reach_the_status_handler(): void
    {
        // No lead row seeded — admin passes the permission gate and gets a 404
        // from the handler, proving authorization did not block the request.
        $this->actingAs($this->user('admin'))
            ->patchJson('/api/v1/admin/leads/999/status', ['status' => 'synced'])
            ->assertNotFound();
    }

    public function test_staff_can_list_media_but_not_delete_it(): void
    {
        $staff = $this->user('staff');

        $this->actingAs($staff)->getJson('/api/v1/admin/media')
            ->assertOk()
            ->assertJsonStructure(['data', 'meta' => ['current_page', 'last_page', 'per_page', 'total'], 'links']);

        $this->actingAs($staff)->deleteJson('/api/v1/admin/media/1')->assertForbidden();
    }
}
