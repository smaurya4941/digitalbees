'use client';

import { usePathname } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { AdminProviders, useAuth } from '@/components/admin/providers';
import { ToastProvider } from '@/components/admin/ui';
import { AdminShell } from '@/components/admin/AdminShell';

function FullPageLoader() {
  return (
    <div className="grid min-h-dvh place-items-center bg-canvas-sunken">
      <Loader2 className="size-6 animate-spin text-brand-navy" aria-label="Loading" />
    </div>
  );
}

function Gate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { status } = useAuth();

  // The login screen renders outside the authenticated shell.
  if (pathname === '/admin/login') return <>{children}</>;

  if (status === 'loading') return <FullPageLoader />;
  if (status === 'unauthenticated') return <FullPageLoader />; // provider redirects to /admin/login

  return <AdminShell>{children}</AdminShell>;
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminProviders>
      <ToastProvider>
        <Gate>{children}</Gate>
      </ToastProvider>
    </AdminProviders>
  );
}
