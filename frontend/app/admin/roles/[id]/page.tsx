'use client';

import { use } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import { listRoles, roleQueryKeys } from '@/lib/admin/roles';
import { useAuth } from '@/components/admin/providers';
import { RoleEditor } from '@/components/admin/RoleEditor';
import { EmptyState, PageHeading, Spinner } from '@/components/admin/ui';

export default function EditRolePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const roleId = Number(id);
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

  const role = data.data.find((r) => r.id === roleId);

  if (!role) {
    return (
      <div className="pt-12">
        <EmptyState
          title="Role not found"
          description={`No role exists with ID “${id}”.`}
          action={
            <Link href="/admin/roles" className="text-sm font-medium text-brand-navy hover:underline">
              Back to roles
            </Link>
          }
        />
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
        <PageHeading title={role.name} description={role.description ?? 'Adjust what this role can do.'} />
      </div>
      <RoleEditor role={role} catalog={data.meta.permissions} />
    </div>
  );
}
