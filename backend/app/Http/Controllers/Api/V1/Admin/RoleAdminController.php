<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Api\V1\ApiController;
use App\Support\Http\ApiResponse;
use Database\Seeders\RoleSeeder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

/**
 * Back-office role & permission management. Gated by `permission:roles.manage`.
 *
 * The built-in roles ({@see RoleSeeder::ROLES}) cannot be deleted and the
 * `admin` role's permission set is immutable (it always holds every permission
 * via a Gate::before short-circuit).
 */
class RoleAdminController extends ApiController
{
    public function index(): JsonResponse
    {
        $roles = Role::query()
            ->with('permissions:id,name')
            ->withCount('users')
            ->orderBy('name')
            ->get();

        return ApiResponse::collection(
            $roles->map(fn (Role $role) => $this->present($role)),
            [
                'permissions' => $this->catalog(),
                'builtin' => array_keys(RoleSeeder::ROLES),
            ],
        );
    }

    public function show(int $id): JsonResponse
    {
        return ApiResponse::item($this->present($this->find($id)));
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:50', 'regex:/^[a-z][a-z0-9-]*$/', 'unique:roles,name'],
            'description' => ['nullable', 'string', 'max:255'],
            'permissions' => ['array'],
            'permissions.*' => ['string', Rule::exists('permissions', 'name')->where('guard_name', 'web')],
        ]);

        $role = Role::create([
            'name' => $data['name'],
            'guard_name' => 'web',
            'description' => $data['description'] ?? null,
        ]);
        $role->syncPermissions($data['permissions'] ?? []);
        $this->flushPermissionCache();

        return ApiResponse::item($this->present($role->load('permissions')), ['created' => true])
            ->setStatusCode(201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $role = $this->find($id);

        $data = $request->validate([
            'description' => ['sometimes', 'nullable', 'string', 'max:255'],
            'permissions' => ['sometimes', 'array'],
            'permissions.*' => ['string', Rule::exists('permissions', 'name')->where('guard_name', 'web')],
        ]);

        if ($role->name === 'admin' && $request->has('permissions')) {
            abort(422, 'The admin role always holds every permission and cannot be changed.');
        }

        if (array_key_exists('description', $data)) {
            $role->update(['description' => $data['description']]);
        }

        if (array_key_exists('permissions', $data)) {
            $role->syncPermissions($data['permissions']);
        }

        $this->flushPermissionCache();

        return ApiResponse::item($this->present($role->load('permissions')));
    }

    public function destroy(int $id): JsonResponse
    {
        $role = $this->find($id);

        if (array_key_exists($role->name, RoleSeeder::ROLES)) {
            abort(422, 'Built-in roles cannot be deleted.');
        }

        if ($role->users()->exists()) {
            abort(422, 'Reassign the accounts on this role before deleting it.');
        }

        $role->delete();
        $this->flushPermissionCache();

        return ApiResponse::item(['deleted' => true, 'id' => $id]);
    }

    private function find(int $id): Role
    {
        return Role::query()->with('permissions')->find($id)
            ?? throw new NotFoundHttpException("Role [{$id}] not found.");
    }

    /** @return array<string, mixed> */
    private function present(Role $role): array
    {
        $isAdmin = $role->name === 'admin';

        return [
            'id' => $role->id,
            'name' => $role->name,
            'description' => $role->description,
            'users_count' => $role->users_count ?? $role->users()->count(),
            'is_builtin' => array_key_exists($role->name, RoleSeeder::ROLES),
            'is_admin' => $isAdmin,
            'permissions' => $isAdmin
                ? Permission::query()->orderBy('name')->pluck('name')->all()
                : $role->permissions->pluck('name')->sort()->values()->all(),
        ];
    }

    /** @return array<string, list<array{name: string, description: string|null}>> */
    private function catalog(): array
    {
        return Permission::query()
            ->orderBy('name')
            ->get()
            ->groupBy('group')
            ->map(fn ($perms) => $perms
                ->map(fn (Permission $p) => ['name' => $p->name, 'description' => $p->description])
                ->values()
                ->all(),
            )
            ->all();
    }

    private function flushPermissionCache(): void
    {
        app(PermissionRegistrar::class)->forgetCachedPermissions();
    }
}
