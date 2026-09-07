<?php

namespace App\Modules\Auth\Services;

use App\Mail\UserInvitationMail;
use App\Models\User;
use App\Support\Enums\UserStatus;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Symfony\Component\HttpKernel\Exception\HttpException;

/**
 * Back-office account lifecycle: invite, accept, edit, suspend, reactivate.
 * Authorization is enforced by `permission:users.manage` on the routes; the
 * "can't lock yourself or the last admin out" rules live in the controller.
 */
final class UserService
{
    private const INVITE_TTL_DAYS = 7;

    /** @param  array<string, mixed>  $filters */
    public function paginate(array $filters, int $perPage): LengthAwarePaginator
    {
        return User::query()
            ->with('roles:id,name')
            ->when(
                filled($filters['q'] ?? null),
                fn ($q) => $q->where(fn ($w) => $w
                    ->where('name', 'like', '%'.$filters['q'].'%')
                    ->orWhere('email', 'like', '%'.$filters['q'].'%')),
            )
            ->when(filled($filters['status'] ?? null), fn ($q) => $q->where('status', $filters['status']))
            ->when(
                filled($filters['role'] ?? null),
                fn ($q) => $q->whereHas('roles', fn ($r) => $r->where('name', $filters['role'])),
            )
            ->orderByDesc('id')
            ->paginate($perPage);
    }

    public function invite(string $name, string $email, string $role): User
    {
        $user = User::create([
            'name' => $name,
            'email' => $email,
            'password' => Hash::make(Str::random(40)),
            'status' => UserStatus::Invited->value,
            'invitation_token' => Str::random(64),
            'invitation_sent_at' => now(),
        ]);

        $user->syncRoles([$role]);
        Mail::to($user->email)->send(new UserInvitationMail($user));

        return $user->load('roles:id,name');
    }

    public function resendInvite(User $user): User
    {
        if ($user->status !== UserStatus::Invited) {
            throw new HttpException(422, 'This account has already accepted its invitation.');
        }

        $user->forceFill([
            'invitation_token' => Str::random(64),
            'invitation_sent_at' => now(),
        ])->save();

        Mail::to($user->email)->send(new UserInvitationMail($user));

        return $user;
    }

    public function findByInvitationToken(string $token): ?User
    {
        $user = User::query()->where('invitation_token', $token)->first();

        if ($user === null || $user->invitation_sent_at?->lt(now()->subDays(self::INVITE_TTL_DAYS))) {
            return null;
        }

        return $user;
    }

    public function acceptInvite(string $token, string $password): User
    {
        $user = $this->findByInvitationToken($token)
            ?? throw new HttpException(422, 'This invitation is invalid or has expired.');

        $user->forceFill([
            'password' => Hash::make($password),
            'status' => UserStatus::Active->value,
            'invitation_token' => null,
            'invitation_sent_at' => null,
        ])->save();

        return $user;
    }

    /** @param  array<string, mixed>  $data */
    public function update(User $user, array $data): User
    {
        $user->fill(Arr::only($data, ['name']))->save();

        if (isset($data['role'])) {
            $user->syncRoles([$data['role']]);
        }

        return $user->fresh(['roles:id,name']);
    }

    public function setStatus(User $user, UserStatus $status): User
    {
        $user->forceFill(['status' => $status->value])->save();

        return $user;
    }
}
