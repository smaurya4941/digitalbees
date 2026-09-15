import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Server-side gate for `/admin`.
 *
 * This is a coarse check: it only confirms a Laravel session cookie is present,
 * so we never stream the admin shell to logged-out visitors or crawlers. The
 * authoritative check is the `GET /user` call in `<AuthProvider>`, which ends
 * the session on a 401 and bounces to `/admin/login`.
 *
 * We deliberately do *not* redirect away from `/admin/login` when a cookie is
 * present — a stale-but-present cookie would cause a redirect loop with the
 * client-side auth bounce.
 */
// Laravel derives its session cookie from `APP_NAME` (`teambees-session`);
// `laravel-session` covers a deploy that has not set APP_NAME yet.
const KNOWN_SESSION_COOKIES = [
  process.env.NEXT_PUBLIC_ADMIN_SESSION_COOKIE,
  'teambees-session',
  'laravel-session',
].filter(Boolean) as string[];

function hasAdminSession(request: NextRequest): boolean {
  if (KNOWN_SESSION_COOKIES.some((name) => request.cookies.has(name))) {
    return true;
  }
  for (const cookie of request.cookies.getAll()) {
    if (cookie.name.endsWith('-session') || cookie.name.startsWith('remember_web_')) {
      return true;
    }
  }
  return false;
}

/** Reachable without a session — login and the invitation-acceptance flow. */
const PUBLIC_ADMIN_PATHS = ['/admin/login', '/admin/accept-invite'];

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (PUBLIC_ADMIN_PATHS.includes(pathname)) {
    return NextResponse.next();
  }

  if (hasAdminSession(request)) {
    return NextResponse.next();
  }

  const loginUrl = new URL('/admin/login', request.url);
  loginUrl.searchParams.set('next', `${pathname}${search}`);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ['/admin', '/admin/:path*'],
};
