<?php

use App\Http\Middleware\EnsureUserIsActive;
use App\Http\Middleware\ForceJsonResponse;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Validation\ValidationException;
use Spatie\Permission\Exceptions\UnauthorizedException;
use Spatie\Permission\Middleware\PermissionMiddleware;
use Spatie\Permission\Middleware\RoleMiddleware;
use Spatie\Permission\Middleware\RoleOrPermissionMiddleware;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
        apiPrefix: 'api',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        // Sanctum SPA: same-domain requests from the Next.js frontend are
        // authenticated with the encrypted, HTTP-only session cookie. This
        // prepends EnsureFrontendRequestsAreStateful to the `api` group.
        $middleware->statefulApi();

        $middleware->api(prepend: [
            ForceJsonResponse::class,
        ]);

        $middleware->throttleApi('api');

        // Public conversion endpoints are called cross-origin from the marketing
        // site without a session; they are protected by rate limiting + honeypot,
        // not CSRF. Everything else stateful (admin login, content writes) keeps
        // CSRF protection.
        $middleware->validateCsrfTokens(except: [
            'api/v1/leads',
            'api/v1/newsletter',
            'api/v1/chatbot/message',
            'api/v1/careers/*/apply',
        ]);

        $middleware->alias([
            'role' => RoleMiddleware::class,
            'permission' => PermissionMiddleware::class,
            'role_or_permission' => RoleOrPermissionMiddleware::class,
            'active' => EnsureUserIsActive::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        // One JSON error shape for the SPA/SSR frontend across every failure mode.
        $exceptions->render(function (ValidationException $e, Request $request) {
            if ($request->is('api/*')) {
                return response()->json([
                    'message' => $e->getMessage(),
                    'errors' => $e->errors(),
                ], $e->status);
            }

            return null;
        });

        $exceptions->render(function (AuthenticationException $e, Request $request) {
            if ($request->is('api/*')) {
                return response()->json(['message' => 'Unauthenticated.'], 401);
            }

            return null;
        });

        $exceptions->render(function (UnauthorizedException $e, Request $request) {
            if ($request->is('api/*')) {
                return response()->json([
                    'message' => 'This action is not authorized for your role.',
                ], 403);
            }

            return null;
        });

        $exceptions->render(function (AuthorizationException $e, Request $request) {
            if ($request->is('api/*') && ! $e instanceof HttpExceptionInterface) {
                return response()->json(['message' => $e->getMessage() ?: 'This action is not authorized.'], 403);
            }

            return null;
        });
    })
    ->booted(function (): void {
        RateLimiter::for('api', fn (Request $request) => Limit::perMinute(120)->by($request->ip()));
        RateLimiter::for('leads', fn (Request $request) => Limit::perMinute(10)->by($request->ip()));
        RateLimiter::for('auth', fn (Request $request) => [
            Limit::perMinute(5)->by($request->input('email').'|'.$request->ip()),
            Limit::perMinute(20)->by($request->ip()),
        ]);
    })
    ->create();
