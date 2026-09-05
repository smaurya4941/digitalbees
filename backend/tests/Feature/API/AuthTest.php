<?php

namespace Tests\Feature\API;

use App\Models\User;
use App\Support\Enums\UserStatus;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RoleSeeder::class);
    }

    private function makeUser(string $role, array $overrides = []): User
    {
        $user = User::factory()->create(array_merge([
            'email' => "{$role}-".uniqid().'@example.com',
            'password' => Hash::make('secret-password'),
        ], $overrides));
        $user->syncRoles([$role]);

        return $user;
    }

    public function test_login_starts_a_session_and_returns_the_profile(): void
    {
        $user = $this->makeUser('staff');

        $response = $this->postJson('/api/v1/login', [
            'email' => $user->email,
            'password' => 'secret-password',
        ]);

        $response->assertOk()
            ->assertJsonPath('data.email', $user->email)
            ->assertJsonPath('data.role', 'staff')
            ->assertJsonStructure(['data' => ['id', 'name', 'email', 'role', 'permissions', 'status']]);

        $this->assertAuthenticatedAs($user);
        $this->assertContains('content.create', $response->json('data.permissions'));
        $this->assertNotContains('content.delete', $response->json('data.permissions'));
    }

    public function test_admin_login_exposes_every_permission(): void
    {
        $user = $this->makeUser('admin');

        $this->postJson('/api/v1/login', ['email' => $user->email, 'password' => 'secret-password'])
            ->assertOk()
            ->assertJsonPath('data.role', 'admin')
            ->assertJsonFragment(['content.delete'])
            ->assertJsonFragment(['users.manage']);
    }

    public function test_login_rejects_bad_credentials(): void
    {
        $user = $this->makeUser('staff');

        $this->postJson('/api/v1/login', ['email' => $user->email, 'password' => 'wrong'])
            ->assertStatus(422)
            ->assertJsonValidationErrors('email');

        $this->assertGuest();
    }

    public function test_login_rejects_suspended_accounts(): void
    {
        $user = $this->makeUser('staff', ['status' => UserStatus::Suspended->value]);

        $this->postJson('/api/v1/login', ['email' => $user->email, 'password' => 'secret-password'])
            ->assertStatus(422);

        $this->assertGuest();
    }

    public function test_login_is_rate_limited(): void
    {
        $user = $this->makeUser('staff');

        foreach (range(1, 5) as $_) {
            $this->postJson('/api/v1/login', ['email' => $user->email, 'password' => 'wrong']);
        }

        $this->postJson('/api/v1/login', ['email' => $user->email, 'password' => 'wrong'])
            ->assertStatus(429);
    }

    public function test_user_endpoint_requires_authentication(): void
    {
        $this->getJson('/api/v1/user')->assertUnauthorized();
    }

    public function test_authenticated_user_can_read_profile_and_log_out(): void
    {
        $user = $this->makeUser('admin');

        $this->actingAs($user)->getJson('/api/v1/user')
            ->assertOk()
            ->assertJsonPath('data.email', $user->email);

        $this->actingAs($user)->postJson('/api/v1/logout')->assertOk();
    }

    public function test_suspended_user_with_a_live_session_is_blocked_by_active_middleware(): void
    {
        $user = $this->makeUser('staff');
        $user->update(['status' => UserStatus::Suspended->value]);

        $this->actingAs($user)->getJson('/api/v1/user')->assertForbidden();
    }
}
