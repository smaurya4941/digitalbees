'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { MailPlus, Plus } from 'lucide-react';
import {
  type AdminUser,
  inviteUser,
  listUsers,
  reactivateUser,
  resendInvite,
  suspendUser,
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

const STATUS_STYLES: Record<string, string> = {
  active: 'bg-green-50 text-green-700',
  invited: 'bg-amber-50 text-amber-700',
  suspended: 'bg-red-50 text-red-700',
};

export default function AdminUsersPage() {
  const { can, user: me } = useAuth();
  const toast = useToast();
  const queryClient = useQueryClient();
  const [status, setStatus] = useState('');
  const [q, setQ] = useState('');
  const [inviting, setInviting] = useState(false);

  const canManage = can('users.manage');

  const { data, isLoading, isError } = useQuery({
    queryKey: userQueryKeys.list({ status, q }),
    queryFn: ({ signal }) => listUsers({ status, q }, signal),
    enabled: canManage,
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: userQueryKeys.all });

  const actionMutation = useMutation({
    mutationFn: ({ action, id }: { action: 'suspend' | 'reactivate' | 'resend'; id: number }) =>
      action === 'suspend'
        ? suspendUser(id)
        : action === 'reactivate'
          ? reactivateUser(id)
          : resendInvite(id),
    onSuccess: (_res, { action }) => {
      toast.success(
        action === 'suspend'
          ? 'Account suspended.'
          : action === 'reactivate'
            ? 'Account reactivated.'
            : 'Invitation resent.',
      );
      void invalidate();
    },
    onError: (error) =>
      toast.error(error instanceof AdminApiError ? error.message : 'Could not complete the action.'),
  });

  if (!canManage) {
    return <EmptyState title="Access denied" description="You do not have permission to manage accounts." />;
  }

  const users = data?.data ?? [];
  const roles = data?.meta.roles ?? [];

  return (
    <div className="space-y-6">
      <PageHeading
        title="Staff accounts"
        description="Who can sign in to the back office, and what they can do."
        actions={
          <AdminButton onClick={() => setInviting(true)} iconLeft={<Plus className="size-4" />}>
            Invite
          </AdminButton>
        }
      />

      <div className="flex flex-wrap gap-3">
        <TextInput
          className="h-10 w-56"
          placeholder="Search name or email"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <Select className="h-10 w-40" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All statuses</option>
          <option value="active">Active</option>
          <option value="invited">Invited</option>
          <option value="suspended">Suspended</option>
        </Select>
      </div>

      <Panel>
        {isLoading ? (
          <Spinner />
        ) : isError ? (
          <EmptyState title="Couldn’t load accounts" description="Refresh the page to try again." />
        ) : users.length === 0 ? (
          <EmptyState title="No accounts match" description="Adjust the filters or invite someone." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-sm">
              <thead>
                <tr className="border-b border-hairline text-left text-xs font-semibold uppercase tracking-wide text-ink-subtle">
                  <th className="px-5 py-3">Name</th>
                  <th className="px-5 py-3">Role</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Last login</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-hairline">
                {users.map((u) => (
                  <UserRow
                    key={u.id}
                    user={u}
                    isSelf={me?.id === u.id}
                    pending={actionMutation.isPending}
                    onAction={(action) => actionMutation.mutate({ action, id: u.id })}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>

      {inviting && (
        <InviteDialog
          roles={roles}
          onClose={() => setInviting(false)}
          onInvited={() => {
            setInviting(false);
            void invalidate();
          }}
        />
      )}
    </div>
  );
}

function UserRow({
  user,
  isSelf,
  pending,
  onAction,
}: {
  user: AdminUser;
  isSelf: boolean;
  pending: boolean;
  onAction: (action: 'suspend' | 'reactivate' | 'resend') => void;
}) {
  return (
    <tr className="transition-colors hover:bg-neutral-50">
      <td className="px-5 py-3.5">
        <Link href={`/admin/users/${user.id}`} className="font-medium text-ink hover:text-brand-navy">
          {user.name}
        </Link>
        <div className="text-xs text-ink-subtle">{user.email}</div>
      </td>
      <td className="px-5 py-3.5 text-ink-muted">{user.role ?? '—'}</td>
      <td className="px-5 py-3.5">
        <span
          className={`inline-flex rounded-full px-2 py-1 text-xs font-medium capitalize ${
            STATUS_STYLES[user.status] ?? 'bg-neutral-100 text-neutral-700'
          }`}
        >
          {user.status}
        </span>
      </td>
      <td className="px-5 py-3.5 text-ink-subtle">
        {user.last_login_at ? dayjs(user.last_login_at).format('MMM D, YYYY') : 'Never'}
      </td>
      <td className="px-5 py-3.5">
        <div className="flex items-center justify-end gap-2">
          {user.status === 'invited' && (
            <button
              onClick={() => onAction('resend')}
              disabled={pending}
              className="inline-flex items-center gap-1 text-xs font-medium text-brand-navy hover:underline disabled:opacity-50"
            >
              <MailPlus className="size-3.5" /> Resend
            </button>
          )}
          {user.status === 'suspended' ? (
            <button
              onClick={() => onAction('reactivate')}
              disabled={pending}
              className="text-xs font-medium text-green-700 hover:underline disabled:opacity-50"
            >
              Reactivate
            </button>
          ) : (
            !isSelf && (
              <button
                onClick={() => onAction('suspend')}
                disabled={pending}
                className="text-xs font-medium text-danger hover:underline disabled:opacity-50"
              >
                Suspend
              </button>
            )
          )}
        </div>
      </td>
    </tr>
  );
}

function InviteDialog({
  roles,
  onClose,
  onInvited,
}: {
  roles: string[];
  onClose: () => void;
  onInvited: () => void;
}) {
  const toast = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState(roles.find((r) => r !== 'admin') ?? roles[0] ?? '');

  const mutation = useMutation({
    mutationFn: () => inviteUser({ name, email, role }),
    onSuccess: () => {
      toast.success(`Invitation sent to ${email}.`);
      onInvited();
    },
    onError: (error) => {
      if (error instanceof AdminApiError && Object.keys(error.errors).length) {
        toast.error(Object.values(error.errors)[0]?.[0] ?? 'Please check the form.');
      } else {
        toast.error('Could not send the invitation.');
      }
    },
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-brand-navy-deep/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-2xl border border-hairline bg-white p-6 shadow-xl">
        <h3 className="text-lg font-semibold text-ink">Invite a teammate</h3>
        <p className="mt-1 text-sm text-ink-muted">
          They’ll get an email with a link to set their password.
        </p>
        <form
          className="mt-4 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            mutation.mutate();
          }}
        >
          <Field label="Name" required>
            <TextInput value={name} onChange={(e) => setName(e.target.value)} required />
          </Field>
          <Field label="Email" required>
            <TextInput
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Field>
          <Field label="Role" required>
            <Select value={role} onChange={(e) => setRole(e.target.value)} required>
              {roles.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </Select>
          </Field>
          <div className="flex justify-end gap-2 pt-2">
            <AdminButton type="button" variant="ghost" onClick={onClose} disabled={mutation.isPending}>
              Cancel
            </AdminButton>
            <AdminButton type="submit" loading={mutation.isPending}>
              Send invite
            </AdminButton>
          </div>
        </form>
      </div>
    </div>
  );
}
