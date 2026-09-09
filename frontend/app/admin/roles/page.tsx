'use client';

import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, ShieldCheck, Trash2 } from 'lucide-react';
import { listRoles, deleteRole, roleQueryKeys } from '@/lib/admin/roles';
import { useAuth } from '@/components/admin/providers';
import { EmptyState, PageHeading, Panel, Spinner, useToast } from '@/components/admin/ui';
import { AdminApiError } from '@/lib/admin/http';

export default function AdminRolesPage() {
  const { can } = useAuth();
  const canManage = can('roles.manage');
  const queryClient = useQueryClient();
  const toast = useToast();

  const { data, isLoading, isError } = useQuery({
    queryKey: roleQueryKeys.all,
    queryFn: ({ signal }) => listRoles(signal),
    enabled: canManage,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteRole(id),
    onSuccess: () => {
      toast.success('Role deleted.');
      void queryClient.invalidateQueries({ queryKey: roleQueryKeys.all });
    },
    onError: (error) => {
      if (error instanceof AdminApiError && error.status === 422) {
        toast.error(error.message || 'Cannot delete role.');
      } else {
        toast.error('Could not delete the role.');
      }
    },
  });

  if (!canManage) {
    return (
      <EmptyState title="Access denied" description="You do not have permission to manage roles." />
    );
  }

  const roles = data?.data ?? [];

  const handleDelete = (id: number, name: string, usersCount: number) => {
    if (usersCount > 0) {
      toast.error('Reassign the accounts on this role before deleting it.');
      return;
    }
    if (window.confirm(`Are you sure you want to delete the role "${name}"? This cannot be undone.`)) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeading
        title="Roles &amp; permissions"
        description="What each back-office role can do. Access is decided by permission, never by role name."
        actions={
          <Link
            href="/admin/roles/new"
            className="inline-flex h-11 items-center gap-2 rounded-xl bg-brand-navy px-5 text-sm font-medium text-white hover:bg-brand-navy-deep"
          >
            <Plus className="size-4" /> New role
          </Link>
        }
      />

      <Panel>
        {isLoading ? (
          <Spinner />
        ) : isError ? (
          <EmptyState title="Couldn’t load roles" description="Refresh the page to try again." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] text-sm">
              <thead>
                <tr className="border-b border-hairline text-left text-xs font-semibold uppercase tracking-wide text-ink-subtle">
                  <th className="px-5 py-3">Role</th>
                  <th className="px-5 py-3">Accounts</th>
                  <th className="px-5 py-3">Permissions</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-hairline">
                {roles.map((role) => (
                  <tr key={role.id} className="transition-colors hover:bg-neutral-50">
                    <td className="px-5 py-3.5">
                      <Link
                        href={`/admin/roles/${role.id}`}
                        className="inline-flex items-center gap-2 font-medium text-ink hover:text-brand-navy"
                      >
                        <ShieldCheck className="size-4 text-ink-subtle" />
                        {role.name}
                        {role.is_builtin && (
                          <span className="rounded bg-neutral-100 px-1.5 py-0.5 text-[10px] font-medium uppercase text-ink-subtle">
                            Built-in
                          </span>
                        )}
                      </Link>
                      {role.description && (
                        <div className="mt-0.5 text-xs text-ink-subtle">{role.description}</div>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-ink-muted">{role.users_count}</td>
                    <td className="px-5 py-3.5 text-ink-muted">
                      {role.is_admin ? 'All' : `${role.permissions.length}`}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      {!role.is_builtin && (
                        <button
                          type="button"
                          onClick={() => handleDelete(role.id, role.name, role.users_count)}
                          className="p-2 text-ink-subtle hover:text-red-600 transition-colors"
                          title="Delete role"
                          disabled={deleteMutation.isPending}
                        >
                          <Trash2 className="size-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>
    </div>
  );
}
