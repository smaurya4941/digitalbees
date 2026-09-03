<?php

namespace App\Modules\Auth\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

/**
 * A granular capability (schema.sql Module 1), e.g. `practice.publish`.
 */
class Permission extends Model
{
    protected $guarded = [];

    public function roles(): BelongsToMany
    {
        return $this->belongsToMany(Role::class, 'role_has_permissions');
    }
}
