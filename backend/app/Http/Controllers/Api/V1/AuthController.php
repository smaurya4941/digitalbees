<?php

namespace App\Http\Controllers\Api\V1;

use App\Modules\Auth\Http\Requests\LoginRequest;
use App\Support\Http\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

/**
 * Sanctum SPA authentication (stateful, HTTP-only session cookie).
 *
 * Flow the Next.js admin panel follows:
 *   1. GET  /sanctum/csrf-cookie   (Sanctum, sets the XSRF-TOKEN cookie)
 *   2. POST /api/v1/login          (this — starts the session)
 *   3. GET  /api/v1/user           (hydrate the client with user + abilities)
 *   4. POST /api/v1/logout         (ends the session)
 *
 * No tokens are issued or stored in the browser.
 */
class AuthController extends ApiController
{
    /** POST /api/v1/login */
    public function login(LoginRequest $request): JsonResponse
    {
        $credentials = $request->only('email', 'password');

        if (! Auth::attempt($credentials, $request->boolean('remember'))) {
            throw ValidationException::withMessages([
                'email' => [__('auth.failed')],
            ]);
        }

        $user = $request->user();

        if (! $user->isActive()) {
            Auth::guard('web')->logout();

            throw ValidationException::withMessages([
                'email' => ['This account is not active. Contact an administrator.'],
            ]);
        }

        // Fixation defence — present for real stateful SPA requests; absent for
        // token / test callers that never carry a session.
        if ($request->hasSession()) {
            $request->session()->regenerate();
        }

        return ApiResponse::item($this->profile($user));
    }

    /** GET /api/v1/user */
    public function me(Request $request): JsonResponse
    {
        return ApiResponse::item($this->profile($request->user()));
    }

    /** POST /api/v1/logout */
    public function logout(Request $request): JsonResponse
    {
        Auth::guard('web')->logout();

        if ($request->hasSession()) {
            $request->session()->invalidate();
            $request->session()->regenerateToken();
        }

        return ApiResponse::item(['status' => 'logged_out']);
    }

    /** @return array<string, mixed> */
    private function profile(\App\Models\User $user): array
    {
        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'department' => $user->department,
            'status' => $user->status->value,
            'role' => $user->primary_role,
            'permissions' => $user->getAllPermissions()->pluck('name')->values(),
        ];
    }
}
