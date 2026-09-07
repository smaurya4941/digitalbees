<?php

namespace App\Http\Controllers\Api\V1;

use App\Modules\Auth\Http\Requests\AcceptInvitationRequest;
use App\Modules\Auth\Services\UserService;
use App\Support\Http\ApiResponse;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

/**
 * Public endpoints for a pending account invitation. No auth — the opaque
 * `invitation_token` is the credential. Throttled by the global `api` limiter.
 */
class InvitationController extends ApiController
{
    public function __construct(private readonly UserService $users) {}

    /** GET /api/v1/invitations/{token} — resolve the invite so the accept page can greet the user. */
    public function show(string $token): JsonResponse
    {
        $user = $this->users->findByInvitationToken($token)
            ?? throw new NotFoundHttpException('This invitation is invalid or has expired.');

        return ApiResponse::item(['name' => $user->name, 'email' => $user->email]);
    }

    /** POST /api/v1/invitations/accept — set a password and activate the account. */
    public function accept(AcceptInvitationRequest $request): JsonResponse
    {
        $this->users->acceptInvite($request->string('token'), $request->string('password'));

        return ApiResponse::item(['status' => 'active']);
    }
}
