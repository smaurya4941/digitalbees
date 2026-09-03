<?php

namespace App\Modules\Auth\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

/**
 * An access-control role (schema.sql Module 1). Column layout is
 * Spatie-compatible so laravel-permission can be adopted later without a
 * reshape; for now the module ships a lightweight native implementation.
 */
class Role extends Model
{
    protected $guarded = [];

    public function permissions(): BelongsToMany
    {
        return $this->belongsToMany(Permission::class, 'role_has_permissions');
    }
}
