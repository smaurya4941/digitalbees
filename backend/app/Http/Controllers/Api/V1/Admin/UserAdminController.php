<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Api\V1\ApiController;
use App\Models\User;
use App\Modules\Auth\Http\Requests\InviteUserRequest;
use App\Modules\Auth\Http\Requests\UpdateUserRequest;
use App\Modules\Auth\Http\Resources\UserAdminResource;
use App\Modules\Auth\Services\UserService;
use App\Support\Enums\UserStatus;
use App\Support\Http\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

/**
 * Back-office account management. Gated by `permission:users.manage`.
 *
 * Safety rails: an admin can never suspend, delete or demote themselves, and
 * the last active admin account is protected the same way.
 */
class UserAdminController extends ApiController
{
    public function __construct(private readonly UserService $users) {}

    public function index(Request $request): JsonResponse
    {
        $paginator = $this->users->paginate(
            $request->only(['q', 'status', 'role']),
            (int) $request->integer('per_page', 25),
        );

        return ApiResponse::page(
            $paginator,
            fn (User $user) => (new UserAdminResource($user))->resolve(),
            [
                'statuses' => UserStatus::values(),
                'roles' => Role::query()->orderBy('name')->pluck('name'),
            ],
        );
    }

    public function show(int $id): JsonResponse
    {
        return ApiResponse::item(new UserAdminResource($this->find($id)));
    }

    public function store(InviteUserRequest $request): JsonResponse
    {
        $user = $this->users->invite(
            $request->string('name'),
            $request->string('email'),
            $request->string('role'),
        );

        return ApiResponse::item(new UserAdminResource($user), ['invited' => true])
            ->setStatusCode(201);
    }

    public function update(UpdateUserRequest $request, int $id): JsonResponse
    {
        $user = $this->find($id);
        $data = $request->validated();

        if (isset($data['role']) && $data['role'] !== $user->roles->first()?->name) {
            if ($request->user()?->is($user)) {
                abort(422, 'You cannot change your own role. Ask another administrator.');
            }
            if ($data['role'] !== 'admin') {
                $this->guardLastAdmin($user, 'change the role of');
            }
        }

        return ApiResponse::item(new UserAdminResource($this->users->update($user, $data)));
    }

    public function resendInvite(int $id): JsonResponse
    {
        return ApiResponse::item(new UserAdminResource($this->users->resendInvite($this->find($id))));
    }

    public function suspend(Request $request, int $id): JsonResponse
    {
        $user = $this->find($id);
        $this->guardSelf($request, $user, 'suspend');
        $this->guardLastAdmin($user, 'suspend');

        return ApiResponse::item(
            new UserAdminResource($this->users->setStatus($user, UserStatus::Suspended)),
        );
    }

    public function reactivate(int $id): JsonResponse
    {
        return ApiResponse::item(
            new UserAdminResource($this->users->setStatus($this->find($id), UserStatus::Active)),
        );
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        $user = $this->find($id);
        $this->guardSelf($request, $user, 'delete');
        $this->guardLastAdmin($user, 'delete');

        $user->delete();

        return ApiResponse::item(['deleted' => true, 'id' => $id]);
    }

    private function find(int $id): User
    {
        return User::query()->with('roles:id,name')->find($id)
            ?? throw new NotFoundHttpException("User [{$id}] not found.");
    }

    private function guardSelf(Request $request, User $user, string $action): void
    {
        if ($request->user()?->is($user)) {
            abort(422, "You cannot {$action} your own account.");
        }
    }

    private function guardLastAdmin(User $user, string $action): void
    {
        if (! $user->hasRole('admin')) {
            return;
        }

        $otherActiveAdmins = User::role('admin')
            ->where('users.status', UserStatus::Active->value)
            ->where('users.id', '!=', $user->getKey())
            ->exists();

        if (! $otherActiveAdmins) {
            abort(422, "You cannot {$action} the last active administrator.");
        }
    }
}
