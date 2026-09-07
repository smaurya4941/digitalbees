'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import { listRoles, roleQueryKeys } from '@/lib/admin/roles';
import { useAuth } from '@/components/admin/providers';
import { RoleEditor } from '@/components/admin/RoleEditor';
import { EmptyState, PageHeading, Spinner } from '@/components/admin/ui';

export default function NewRolePage() {
  const { can } = useAuth();
  const canManage = can('roles.manage');

  const { data, isLoading } = useQuery({
    queryKey: roleQueryKeys.all,
    queryFn: ({ signal }) => listRoles(signal),
    enabled: canManage,
  });

  if (!canManage) {
    return <EmptyState title="Access denied" description="You do not have permission to manage roles." />;
  }

  if (isLoading || !data) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/roles"
          className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-ink-muted hover:text-ink"
        >
          <ArrowLeft className="size-4" /> Back to roles
        </Link>
        <PageHeading title="New role" description="Name it, then grant the permissions it needs." />
      </div>
      <RoleEditor catalog={data.meta.permissions} />
    </div>
  );
}
