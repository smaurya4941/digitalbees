<?php

namespace App\Modules\Auth\Concerns;

use App\Modules\Auth\Models\Permission;
use App\Modules\Auth\Models\Role;
use Illuminate\Database\Eloquent\Relations\MorphToMany;
use Illuminate\Support\Collection;

/**
 * Lightweight role/permission access on the User model, backed by the
 * `model_has_roles` polymorphic pivot. Spatie-compatible table layout.
 */
trait HasRoles
{
    public function roles(): MorphToMany
    {
        return $this->morphToMany(Role::class, 'model', 'model_has_roles', 'model_id', 'role_id');
    }

    public function hasRole(string $name): bool
    {
        return $this->roles->contains(fn (Role $role) => $role->name === $name);
    }

    /** @param  array<int, string>  $names */
    public function hasAnyRole(array $names): bool
    {
        return $this->roles->contains(fn (Role $role) => in_array($role->name, $names, true));
    }

    public function isSuperAdmin(): bool
    {
        return $this->hasRole('Super Admin');
    }

    public function hasPermission(string $permission): bool
    {
        if ($this->isSuperAdmin()) {
            return true;
        }

        return $this->permissionNames()->contains($permission);
    }

    /** @return Collection<int, string> */
    public function permissionNames(): Collection
    {
        return $this->roles
            ->loadMissing('permissions')
            ->flatMap(fn (Role $role) => $role->permissions->pluck('name'))
            ->unique()
            ->values();
    }

    public function assignRole(string $name): void
    {
        $role = Role::query()->firstOrCreate(['name' => $name, 'guard_name' => 'web']);
        $this->roles()->syncWithoutDetaching([$role->id]);
        $this->unsetRelation('roles');
    }
}
