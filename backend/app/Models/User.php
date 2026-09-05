<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\Support\Enums\UserStatus;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;

/**
 * A back-office account (admin or staff). Public website visitors are never
 * users — the frontend is fully public and contact happens by email/phone.
 *
 * Authentication: Laravel Sanctum SPA (HTTP-only session cookie).
 * Authorization: spatie/laravel-permission — roles `admin` / `staff`, with
 * the real granularity carried by permissions (see {@see \Database\Seeders\RoleSeeder}).
 */
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasApiTokens;

    use HasFactory;
    use HasRoles;
    use Notifiable;

    /**
     * The guard spatie/laravel-permission resolves roles/permissions against.
     */
    protected string $guard_name = 'web';

    /** @var list<string> */
    protected $fillable = [
        'name',
        'email',
        'password',
        'department',
        'status',
    ];

    /** @var list<string> */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /** @return array<string, string> */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'status' => UserStatus::class,
        ];
    }

    public function isActive(): bool
    {
        return $this->status === UserStatus::Active;
    }

    /**
     * The single role name shown in the UI. Users carry exactly one role in
     * this system even though the store supports many.
     */
    public function getPrimaryRoleAttribute(): ?string
    {
        return $this->roles->first()?->name;
    }
}
