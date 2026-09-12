'use client';

import { createContext, useCallback, useContext, useEffect, useMemo } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { AdminApiError } from '@/lib/admin/http';
import { fetchCurrentUser, logout as logoutRequest } from '@/lib/admin/auth';
import type { AuthUser, Permission } from '@/lib/admin/types';

/* -------------------------------------------------------------------------- */
/*  Query client                                                             */
/* -------------------------------------------------------------------------- */

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        retry: (failureCount, error) => {
          if (error instanceof AdminApiError && error.status < 500) return false;
          return failureCount < 2;
        },
        refetchOnWindowFocus: false,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined;

function getQueryClient() {
  if (typeof window === 'undefined') return makeQueryClient();
  return (browserQueryClient ??= makeQueryClient());
}

/* -------------------------------------------------------------------------- */
/*  Auth context                                                             */
/* -------------------------------------------------------------------------- */

interface AuthContextValue {
  user: AuthUser | null;
  status: 'loading' | 'authenticated' | 'unauthenticated';
  can: (permission: Permission | Permission[]) => boolean;
  isAdmin: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const AUTH_KEY = ['auth', 'me'] as const;

function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const onLoginPage = pathname === '/admin/login';
  const onPublicPage = onLoginPage || pathname === '/admin/accept-invite';

  const query = useQuery({
    queryKey: AUTH_KEY,
    queryFn: ({ signal }) => fetchCurrentUser(signal),
    retry: false,
    staleTime: 60_000,
  });

  const unauthenticated =
    query.isError && query.error instanceof AdminApiError && query.error.isUnauthenticated;

  const user = query.data ?? null;

  const status: AuthContextValue['status'] = query.isLoading
    ? 'loading'
    : user
      ? 'authenticated'
      : 'unauthenticated';

  const can = useCallback(
    (permission: Permission | Permission[]) => {
      if (!user) return false;
      if (user.role === 'admin') return true;
      const needed = Array.isArray(permission) ? permission : [permission];
      return needed.some((p) => user.permissions.includes(p));
    },
    [user],
  );

  const signOut = useCallback(async () => {
    try {
      await logoutRequest();
    } catch {
      // Ignore errors during logout; local session cleanup proceeds in finally
    } finally {
      queryClient.setQueryData(AUTH_KEY, null);
      queryClient.clear();
      router.replace('/admin/login');
    }
  }, [queryClient, router]);

  // Bounce to login once we know there is no session.
  useEffect(() => {
    if (unauthenticated && !onPublicPage) {
      router.replace(`/admin/login?next=${encodeURIComponent(pathname)}`);
    }
  }, [unauthenticated, onPublicPage, pathname, router]);

  // A signed-in user has no business on the login screen.
  useEffect(() => {
    if (status === 'authenticated' && onLoginPage) {
      const next = new URLSearchParams(window.location.search).get('next');
      router.replace(next && next.startsWith('/admin') ? next : '/admin');
    }
  }, [status, onLoginPage, router]);

  const value = useMemo<AuthContextValue>(
    () => ({ user, status, can, isAdmin: user?.role === 'admin', signOut }),
    [user, status, can, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AdminProviders>');
  return ctx;
}

/* -------------------------------------------------------------------------- */
/*  Combined provider                                                        */
/* -------------------------------------------------------------------------- */

export function AdminProviders({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>{children}</AuthProvider>
    </QueryClientProvider>
  );
}
