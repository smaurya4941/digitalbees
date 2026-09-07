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
const SESSION_COOKIE = process.env.NEXT_PUBLIC_ADMIN_SESSION_COOKIE || 'teambees-session';

/** Reachable without a session — login and the invitation-acceptance flow. */
const PUBLIC_ADMIN_PATHS = ['/admin/login', '/admin/accept-invite'];

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (PUBLIC_ADMIN_PATHS.includes(pathname)) {
    return NextResponse.next();
  }

  if (request.cookies.has(SESSION_COOKIE)) {
    return NextResponse.next();
  }

  const loginUrl = new URL('/admin/login', request.url);
  loginUrl.searchParams.set('next', `${pathname}${search}`);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ['/admin', '/admin/:path*'],
};
