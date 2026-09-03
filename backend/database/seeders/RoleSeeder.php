<?php

namespace Database\Seeders;

use App\Models\User;
use App\Modules\Auth\Models\Permission;
use App\Modules\Auth\Models\Role;
use Illuminate\Database\Seeder;

/**
 * The Phase 1 access-control baseline (see phase spec §1.19 / §2.11):
 * five roles, a small permission set, and the seeded admin user promoted
 * to Super Admin. Idempotent.
 */
class RoleSeeder extends Seeder
{
    public function run(): void
    {
        $permissions = [
            'practice.publish', 'practice.edit',
            'industry.publish', 'industry.edit',
            'region.publish', 'region.edit',
            'technology.publish', 'technology.edit',
            'case-study.publish', 'case-study.edit',
            'navigation.edit', 'seo.edit', 'media.manage', 'user.manage',
        ];

        $permissionModels = collect($permissions)->mapWithKeys(fn (string $name) => [
            $name => Permission::firstOrCreate(['name' => $name, 'guard_name' => 'web']),
        ]);

        $roles = [
            'Super Admin' => $permissions,
            'Admin' => $permissions,
            'Editor' => [
                'practice.edit', 'industry.edit', 'region.edit', 'technology.edit', 'case-study.edit',
            ],
            'SEO Manager' => ['seo.edit'],
            'Reviewer' => [
                'practice.publish', 'industry.publish', 'region.publish',
                'technology.publish', 'case-study.publish',
            ],
        ];

        foreach ($roles as $name => $grants) {
            $role = Role::firstOrCreate(['name' => $name, 'guard_name' => 'web']);
            $role->permissions()->sync(
                $permissionModels->only($grants)->pluck('id')->all(),
            );
        }

        $admin = User::query()->where('email', 'test@example.com')->first();
        $admin?->assignRole('Super Admin');
    }
}
