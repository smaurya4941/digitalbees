<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Route guard: the authenticated user must hold at least one of the given
 * roles. Usage: ->middleware('role:Admin,Editor').
 */
class EnsureRole
{
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();

        if ($user === null || ! $user->hasAnyRole($roles)) {
            abort(403, 'This action requires one of the following roles: '.implode(', ', $roles).'.');
        }

        return $next($request);
    }
}
