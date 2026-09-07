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
 *   admin       — full control of the entire website + user/role management.
 *   staff       — create, edit and publish content + media/SEO/navigation.
 *   editor      — create and edit content, but not publish or delete.
 *   seo-manager — edit content and SEO metadata only.
 *   reviewer    — review, approve and publish content submitted by others.
 *
 * Authorization is permission-driven, never `role === 'x'` checks, so the
 * matrix below is the single place to change what a role can do. The built-in
 * roles cannot be deleted; their permission sets can be re-tuned here or in the
 * roles admin screen (`admin` always holds every permission).
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
        'content.review' => ['Submit content for review and comment on it', 'Content'],
        'content.approve' => ['Approve or reject content in review', 'Content'],
        'media.upload' => ['Upload files to the media library', 'Media'],
        'media.delete' => ['Delete files from the media library', 'Media'],
        'seo.update' => ['Edit SEO metadata', 'SEO'],
        'navigation.update' => ['Edit site navigation menus', 'Navigation'],
        'inquiries.view' => ['View contact form submissions', 'Inquiries'],
        'inquiries.manage' => ['Update and export contact submissions', 'Inquiries'],
        'settings.manage' => ['Change site-wide settings', 'System'],
        'users.manage' => ['Create, edit and disable staff accounts', 'System'],
        'roles.manage' => ['Change roles and permissions', 'System'],
        'audit.view' => ['View the activity / audit log', 'System'],
    ];

    /** @var array<string, string> role name => description */
    public const ROLES = [
        'admin' => 'Full control over the entire website, including users and settings.',
        'staff' => 'Create, edit and publish website content.',
        'editor' => 'Create and edit content, but not publish or delete it.',
        'seo-manager' => 'Edit content and SEO metadata only.',
        'reviewer' => 'Review, approve and publish content submitted by others.',
    ];

    /**
     * Roles seeded by the application. These cannot be deleted in the roles
     * admin screen (their permission sets are still editable).
     *
     * @var array<string, list<string>> role => permission names; [] means "every permission"
     */
    public const ROLE_PERMISSIONS = [
        'admin' => [],
        'staff' => [
            'content.create', 'content.update', 'content.publish', 'content.review',
            'media.upload', 'seo.update', 'navigation.update', 'inquiries.view',
        ],
        'editor' => [
            'content.create', 'content.update', 'content.review', 'media.upload', 'seo.update',
        ],
        'seo-manager' => [
            'content.update', 'seo.update',
        ],
        'reviewer' => [
            'content.update', 'content.publish', 'content.review', 'content.approve',
            'inquiries.view', 'audit.view',
        ],
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

        foreach (self::ROLES as $name => $description) {
            $role = Role::updateOrCreate(
                ['name' => $name, 'guard_name' => 'web'],
                ['description' => $description],
            );

            $permissions = self::ROLE_PERMISSIONS[$name] ?: Permission::all();
            $role->syncPermissions($permissions);
        }

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
