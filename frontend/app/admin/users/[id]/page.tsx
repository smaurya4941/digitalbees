'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import {
  type AdminUser,
  deleteUser,
  getUser,
  listUsers,
  reactivateUser,
  suspendUser,
  updateUser,
  userQueryKeys,
} from '@/lib/admin/users';
import { AdminApiError } from '@/lib/admin/http';
import { useAuth } from '@/components/admin/providers';
import {
  AdminButton,
  EmptyState,
  Field,
  PageHeading,
  Panel,
  Select,
  Spinner,
  TextInput,
  useToast,
} from '@/components/admin/ui';

export default function EditUserPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const userId = Number(id);
  const { can } = useAuth();
  const canManage = can('users.manage');

  const { data, isLoading, error } = useQuery({
    queryKey: userQueryKeys.detail(userId),
    queryFn: ({ signal }) => getUser(userId, signal),
    enabled: canManage,
  });

  const { data: rolesData } = useQuery({
    queryKey: userQueryKeys.list({}),
    queryFn: ({ signal }) => listUsers({}, signal),
    enabled: canManage,
  });

  if (!canManage) {
    return <EmptyState title="Access denied" description="You do not have permission to manage accounts." />;
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if ((error instanceof AdminApiError && error.status === 404) || !data) {
    return (
      <div className="pt-12">
        <EmptyState
          title="Account not found"
          description={`No account exists with ID “${id}”.`}
          action={
            <Link href="/admin/users" className="text-sm font-medium text-brand-navy hover:underline">
              Back to accounts
            </Link>
          }
        />
      </div>
    );
  }

  return <UserEditForm user={data} roles={rolesData?.meta.roles ?? []} />;
}

function UserEditForm({ user, roles }: { user: AdminUser; roles: string[] }) {
  const router = useRouter();
  const toast = useToast();
  const queryClient = useQueryClient();
  const { user: me } = useAuth();
  const isSelf = me?.id === user.id;

  const [name, setName] = useState(user.name);
  const [role, setRole] = useState(user.role ?? '');

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: userQueryKeys.all });
    void queryClient.invalidateQueries({ queryKey: userQueryKeys.detail(user.id) });
  };

  const saveMutation = useMutation({
    mutationFn: () => updateUser(user.id, { name, role: role || undefined }),
    onSuccess: (updated) => {
      toast.success('Account updated.');
      queryClient.setQueryData(userQueryKeys.detail(user.id), updated);
      invalidate();
      router.push('/admin/users');
    },
    onError: (err) =>
      toast.error(err instanceof AdminApiError ? err.message : 'Could not save the account.'),
  });

  const statusMutation = useMutation({
    mutationFn: (action: 'suspend' | 'reactivate') =>
      action === 'suspend' ? suspendUser(user.id) : reactivateUser(user.id),
    onSuccess: () => {
      toast.success('Status updated.');
      invalidate();
    },
    onError: (err) =>
      toast.error(err instanceof AdminApiError ? err.message : 'Could not update the status.'),
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteUser(user.id),
    onSuccess: () => {
      toast.success('Account deleted.');
      invalidate();
      router.push('/admin/users');
    },
    onError: (err) =>
      toast.error(err instanceof AdminApiError ? err.message : 'Could not delete the account.'),
  });

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/users"
          className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-ink-muted hover:text-ink"
        >
          <ArrowLeft className="size-4" /> Back to accounts
        </Link>
        <PageHeading title={user.name} description={user.email} />
      </div>

      <form
        className="space-y-6"
        onSubmit={(e) => {
          e.preventDefault();
          saveMutation.mutate();
        }}
      >
        <Panel className="space-y-5 p-6">
          <Field label="Name" required>
            <TextInput value={name} onChange={(e) => setName(e.target.value)} required />
          </Field>
          <Field label="Role" hint={isSelf ? 'You cannot change your own role.' : undefined}>
            <Select value={role} onChange={(e) => setRole(e.target.value)} disabled={isSelf}>
              {roles.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </Select>
          </Field>
          <p className="text-xs text-ink-subtle">
            Status: <span className="capitalize">{user.status}</span>
          </p>
        </Panel>

        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            {user.status === 'suspended' ? (
              <AdminButton
                type="button"
                variant="secondary"
                loading={statusMutation.isPending}
                onClick={() => statusMutation.mutate('reactivate')}
              >
                Reactivate
              </AdminButton>
            ) : (
              !isSelf && (
                <AdminButton
                  type="button"
                  variant="secondary"
                  loading={statusMutation.isPending}
                  onClick={() => statusMutation.mutate('suspend')}
                >
                  Suspend
                </AdminButton>
              )
            )}
            {!isSelf && (
              <AdminButton
                type="button"
                variant="danger"
                loading={deleteMutation.isPending}
                onClick={() => {
                  if (window.confirm(`Delete ${user.name}’s account?`)) deleteMutation.mutate();
                }}
              >
                Delete
              </AdminButton>
            )}
          </div>
          <div className="flex gap-2">
            <AdminButton type="button" variant="ghost" onClick={() => router.push('/admin/users')}>
              Cancel
            </AdminButton>
            <AdminButton type="submit" loading={saveMutation.isPending}>
              Save changes
            </AdminButton>
          </div>
        </div>
      </form>
    </div>
  );
}
