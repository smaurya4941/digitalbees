<?php

namespace Tests\Feature\API;

use App\Mail\UserInvitationMail;
use App\Models\User;
use App\Support\Enums\UserStatus;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class UserAdminTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Mail::fake();
        $this->seed(RoleSeeder::class);
    }

    private function user(string $role, string $status = 'active'): User
    {
        $user = User::factory()->create(['status' => $status]);
        $user->syncRoles([$role]);

        return $user;
    }

    public function test_users_manage_gates_the_screen(): void
    {
        $this->actingAs($this->user('staff'))->getJson('/api/v1/admin/users')->assertForbidden();

        $this->actingAs($this->user('admin'))->getJson('/api/v1/admin/users')
            ->assertOk()
            ->assertJsonStructure(['data', 'meta' => ['current_page', 'total', 'statuses'], 'links']);
    }

    public function test_admin_can_invite_a_user_and_the_invite_can_be_accepted(): void
    {
        $admin = $this->user('admin');

        $invited = $this->actingAs($admin)->postJson('/api/v1/admin/users', [
            'name' => 'New Editor',
            'email' => 'new.editor@example.com',
            'role' => 'editor',
        ]);

        $invited->assertCreated()
            ->assertJsonPath('data.status', 'invited')
            ->assertJsonPath('data.role', 'editor');

        Mail::assertSent(UserInvitationMail::class);

        $user = User::where('email', 'new.editor@example.com')->firstOrFail();
        $token = $user->invitation_token;

        $this->getJson("/api/v1/invitations/{$token}")
            ->assertOk()
            ->assertJsonPath('data.email', 'new.editor@example.com');

        $this->postJson('/api/v1/invitations/accept', [
            'token' => $token,
            'password' => 'sup3rsecret99',
            'password_confirmation' => 'sup3rsecret99',
        ])->assertOk();

        $user->refresh();
        $this->assertSame(UserStatus::Active, $user->status);
        $this->assertNull($user->invitation_token);
    }

    public function test_an_admin_cannot_suspend_or_delete_themselves(): void
    {
        $admin = $this->user('admin');

        $this->actingAs($admin)->postJson("/api/v1/admin/users/{$admin->id}/suspend")->assertStatus(422);
        $this->actingAs($admin)->deleteJson("/api/v1/admin/users/{$admin->id}")->assertStatus(422);
    }

    public function test_the_last_active_admin_is_protected(): void
    {
        $soleAdmin = $this->user('admin');
        $other = $this->user('admin');

        // A second admin exists — suspending one is allowed.
        $this->actingAs($soleAdmin)->postJson("/api/v1/admin/users/{$other->id}/suspend")->assertOk();

        // Now `soleAdmin` is the only active admin — demoting them is blocked.
        $this->actingAs($soleAdmin)
            ->patchJson("/api/v1/admin/users/{$soleAdmin->id}", ['role' => 'staff'])
            ->assertStatus(422);
    }

    public function test_admin_can_change_a_users_role(): void
    {
        $admin = $this->user('admin');
        $target = $this->user('staff');

        $this->actingAs($admin)
            ->patchJson("/api/v1/admin/users/{$target->id}", ['role' => 'reviewer'])
            ->assertOk()
            ->assertJsonPath('data.role', 'reviewer');
    }
}
