<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\User;
use App\Modules\Auth\Http\Requests\LoginRequest;
use App\Support\Http\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

/**
 * Token auth for the CMS / admin API. Issues Sanctum personal access tokens;
 * public read endpoints stay unauthenticated.
 */
class AuthController extends ApiController
{
    /** POST /api/v1/auth/login */
    public function login(LoginRequest $request): JsonResponse
    {
        $user = User::query()->where('email', $request->string('email'))->first();

        if ($user === null || ! Hash::check($request->string('password'), $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['These credentials do not match our records.'],
            ]);
        }

        if ($user->is_active === false) {
            throw ValidationException::withMessages([
                'email' => ['This account is disabled.'],
            ]);
        }

        $token = $user->createToken($request->string('device_name')->value() ?: 'cms')->plainTextToken;

        return ApiResponse::item([
            'token' => $token,
            'user' => $this->userPayload($user),
        ]);
    }

    /** GET /api/v1/auth/me */
    public function me(Request $request): JsonResponse
    {
        return ApiResponse::item($this->userPayload($request->user()));
    }

    /** POST /api/v1/auth/logout */
    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return ApiResponse::item(['status' => 'logged_out']);
    }

    /** @return array<string, mixed> */
    private function userPayload(User $user): array
    {
        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'department' => $user->department,
            'roles' => $user->roles->pluck('name')->values(),
            'permissions' => $user->permissionNames(),
        ];
    }
}
