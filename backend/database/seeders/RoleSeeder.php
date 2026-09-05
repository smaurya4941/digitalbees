<?php

namespace Database\Seeders;

use App\Models\User;
use App\Support\Enums\UserStatus;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

/**
 * The two back-office roles and their permissions.
 *
 *   admin  — full control of the entire website + user/role management.
 *   staff  — create, edit and publish content + media/SEO/navigation.
 *            Cannot delete content, manage accounts, or change settings.
 *
 * Authorization is permission-driven, never `role === 'admin'` checks, so the
 * matrix below is the single place to change what staff can do.
 *
 * Idempotent.
 */
class RoleSeeder extends Seeder
{
    /**
     * permission name => [description, group]
     *
     * @var array<string, array{0: string, 1: string}>
     */
    public const PERMISSIONS = [
        'content.create' => ['Create content entries', 'Content'],
        'content.update' => ['Edit content entries', 'Content'],
        'content.publish' => ['Publish, unpublish and archive content', 'Content'],
        'content.delete' => ['Permanently delete content entries', 'Content'],
        'media.upload' => ['Upload files to the media library', 'Media'],
        'media.delete' => ['Delete files from the media library', 'Media'],
        'seo.update' => ['Edit SEO metadata', 'SEO'],
        'navigation.update' => ['Edit site navigation menus', 'Navigation'],
        'inquiries.view' => ['View contact form submissions', 'Inquiries'],
        'inquiries.manage' => ['Update and export contact submissions', 'Inquiries'],
        'settings.manage' => ['Change site-wide settings', 'System'],
        'users.manage' => ['Create, edit and disable staff accounts', 'System'],
        'roles.manage' => ['Change roles and permissions', 'System'],
    ];

    /** @var array<string, string> role name => description */
    public const ROLES = [
        'admin' => 'Full control over the entire website, including users and settings.',
        'staff' => 'Create, edit and publish website content.',
    ];

    /** Permissions granted to `staff`. `admin` always gets every permission. */
    public const STAFF_PERMISSIONS = [
        'content.create',
        'content.update',
        'content.publish',
        'media.upload',
        'seo.update',
        'navigation.update',
        'inquiries.view',
    ];

    public function run(): void
    {
        app(PermissionRegistrar::class)->forgetCachedPermissions();

        foreach (self::PERMISSIONS as $name => [$description, $group]) {
            Permission::updateOrCreate(
                ['name' => $name, 'guard_name' => 'web'],
                ['description' => $description, 'group' => $group],
            );
        }

        $admin = Role::updateOrCreate(
            ['name' => 'admin', 'guard_name' => 'web'],
            ['description' => self::ROLES['admin']],
        );
        $admin->syncPermissions(Permission::all());

        $staff = Role::updateOrCreate(
            ['name' => 'staff', 'guard_name' => 'web'],
            ['description' => self::ROLES['staff']],
        );
        $staff->syncPermissions(self::STAFF_PERMISSIONS);

        app(PermissionRegistrar::class)->forgetCachedPermissions();

        // Seed / promote the first admin account. Password comes from env in
        // real deploys; falls back to a dev default locally.
        $adminUser = User::updateOrCreate(
            ['email' => env('ADMIN_EMAIL', 'admin@digitalbees.in')],
            [
                'name' => env('ADMIN_NAME', 'Site Admin'),
                'password' => Hash::make(env('ADMIN_PASSWORD', 'password')),
                'status' => UserStatus::Active->value,
            ],
        );
        $adminUser->syncRoles(['admin']);

        if (app()->environment('local', 'testing')) {
            $staffUser = User::updateOrCreate(
                ['email' => 'staff@digitalbees.in'],
                [
                    'name' => 'Staff Member',
                    'password' => Hash::make('password'),
                    'status' => UserStatus::Active->value,
                ],
            );
            $staffUser->syncRoles(['staff']);
        }
    }
}
