<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Blocks authenticated requests from suspended / invited accounts and tears
 * down their session so a disabled user is logged out on their next call.
 */
class EnsureUserIsActive
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if ($user !== null && ! $user->isActive()) {
            if ($request->hasSession()) {
                auth()->guard('web')->logout();
                $request->session()->invalidate();
                $request->session()->regenerateToken();
            }

            abort(403, 'This account is not active.');
        }

        return $next($request);
    }
}
