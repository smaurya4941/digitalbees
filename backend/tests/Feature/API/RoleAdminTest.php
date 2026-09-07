<?php

namespace Tests\Feature\API;

use App\Models\User;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class RoleAdminTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RoleSeeder::class);
    }

    private function user(string $role): User
    {
        $user = User::factory()->create();
        $user->syncRoles([$role]);

        return $user;
    }

    public function test_only_roles_manage_holders_can_read_roles(): void
    {
        $this->actingAs($this->user('staff'))->getJson('/api/v1/admin/roles')->assertForbidden();

        $this->actingAs($this->user('admin'))->getJson('/api/v1/admin/roles')
            ->assertOk()
            ->assertJsonPath('meta.builtin', ['admin', 'staff', 'editor', 'seo-manager', 'reviewer'])
            ->assertJsonStructure(['data' => [['id', 'name', 'permissions', 'is_builtin', 'is_admin', 'users_count']], 'meta' => ['permissions']]);
    }

    public function test_admin_can_retune_a_builtin_roles_permissions(): void
    {
        $editor = Role::findByName('editor');

        $this->actingAs($this->user('admin'))
            ->putJson("/api/v1/admin/roles/{$editor->id}", ['permissions' => ['content.update']])
            ->assertOk()
            ->assertJsonPath('data.permissions', ['content.update']);

        $this->assertFalse($editor->fresh()->hasPermissionTo('content.create'));
    }

    public function test_the_admin_role_permission_set_is_immutable(): void
    {
        $admin = Role::findByName('admin');

        $this->actingAs($this->user('admin'))
            ->putJson("/api/v1/admin/roles/{$admin->id}", ['permissions' => ['content.update']])
            ->assertStatus(422);
    }

    public function test_builtin_roles_cannot_be_deleted(): void
    {
        $staff = Role::findByName('staff');

        $this->actingAs($this->user('admin'))
            ->deleteJson("/api/v1/admin/roles/{$staff->id}")
            ->assertStatus(422);
    }

    public function test_admin_can_create_and_delete_a_custom_role(): void
    {
        $created = $this->actingAs($this->user('admin'))->postJson('/api/v1/admin/roles', [
            'name' => 'translator',
            'description' => 'Manages localized copy.',
            'permissions' => ['content.update'],
        ]);

        $created->assertCreated()->assertJsonPath('data.is_builtin', false);

        $id = $created->json('data.id');

        $this->actingAs($this->user('admin'))->deleteJson("/api/v1/admin/roles/{$id}")->assertOk();
        $this->assertDatabaseMissing('roles', ['name' => 'translator']);
    }

    public function test_role_name_must_be_a_slug(): void
    {
        $this->actingAs($this->user('admin'))
            ->postJson('/api/v1/admin/roles', ['name' => 'Not A Slug'])
            ->assertStatus(422)
            ->assertJsonValidationErrors('name');
    }
}
