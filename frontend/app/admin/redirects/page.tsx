'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2 } from 'lucide-react';
import {
  type AdminRedirect,
  createRedirect,
  deleteRedirect,
  listRedirects,
  redirectQueryKeys,
  updateRedirect,
} from '@/lib/admin/redirects';
import { AdminApiError } from '@/lib/admin/http';
import { useAuth } from '@/components/admin/providers';
import {
  AdminButton,
  EmptyState,
  PageHeading,
  Panel,
  Select,
  Spinner,
  TextInput,
  useToast,
} from '@/components/admin/ui';

const CODES = [301, 302, 307, 308];

export default function AdminRedirectsPage() {
  const { can } = useAuth();
  const toast = useToast();
  const queryClient = useQueryClient();
  const [q, setQ] = useState('');
  const [page, setPage] = useState(1);

  const canManage = can('settings.manage');

  const { data, isLoading, isError } = useQuery({
    queryKey: redirectQueryKeys.list({ q, page }),
    queryFn: ({ signal }) => listRedirects({ q, page }, signal),
    enabled: canManage,
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: redirectQueryKeys.all });

  const createMutation = useMutation({
    mutationFn: createRedirect,
    onSuccess: () => {
      toast.success('Redirect added.');
      void invalidate();
    },
    onError: (error) =>
      toast.error(
        error instanceof AdminApiError && Object.keys(error.errors).length
          ? (Object.values(error.errors)[0]?.[0] ?? 'Please check the paths.')
          : 'Could not add the redirect.',
      ),
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, is_active }: { id: number; is_active: boolean }) =>
      updateRedirect(id, { is_active }),
    onSuccess: () => void invalidate(),
    onError: () => toast.error('Could not update the redirect.'),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteRedirect,
    onSuccess: () => {
      toast.success('Redirect removed.');
      void invalidate();
    },
    onError: () => toast.error('Could not remove the redirect.'),
  });

  if (!canManage) {
    return <EmptyState title="Access denied" description="You do not have permission to manage redirects." />;
  }

  const rows = data?.data ?? [];
  const meta = data?.meta;

  return (
    <div className="space-y-6">
      <PageHeading
        title="Redirects"
        description="301/302 rules served by the site. A 301 is added automatically when a content slug changes."
      />

      <Panel className="p-5">
        <NewRedirectForm pending={createMutation.isPending} onSubmit={(input) => createMutation.mutate(input)} />
      </Panel>

      <div className="flex gap-3">
        <TextInput
          className="h-10 w-64"
          placeholder="Search from / to path"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setPage(1);
          }}
        />
      </div>

      <Panel>
        {isLoading ? (
          <Spinner />
        ) : isError ? (
          <EmptyState title="Couldn’t load redirects" description="Refresh the page to try again." />
        ) : rows.length === 0 ? (
          <EmptyState title="No redirects" description="Add one above, or they’ll appear here when slugs change." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-sm">
              <thead>
                <tr className="border-b border-hairline text-left text-xs font-semibold uppercase tracking-wide text-ink-subtle">
                  <th className="px-5 py-3">From</th>
                  <th className="px-5 py-3">To</th>
                  <th className="px-5 py-3">Code</th>
                  <th className="px-5 py-3">Active</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-hairline">
                {rows.map((r: AdminRedirect) => (
                  <tr key={r.id} className="hover:bg-neutral-50">
                    <td className="px-5 py-3 font-mono text-xs text-ink">{r.from_path}</td>
                    <td className="px-5 py-3 font-mono text-xs text-ink-muted">{r.to_path}</td>
                    <td className="px-5 py-3 text-ink-muted">{r.status_code}</td>
                    <td className="px-5 py-3">
                      <input
                        type="checkbox"
                        className="size-4 rounded border-hairline-strong text-brand-navy"
                        checked={r.is_active}
                        onChange={(e) =>
                          toggleMutation.mutate({ id: r.id, is_active: e.target.checked })
                        }
                      />
                    </td>
                    <td className="px-5 py-3 text-right">
                      <button
                        onClick={() => {
                          if (window.confirm(`Remove the redirect from ${r.from_path}?`)) {
                            deleteMutation.mutate(r.id);
                          }
                        }}
                        className="grid size-9 place-items-center rounded-lg text-ink-muted hover:bg-danger-surface hover:text-danger ml-auto"
                        aria-label={`Remove ${r.from_path}`}
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {meta && meta.last_page > 1 && (
              <div className="flex items-center justify-between border-t border-hairline px-5 py-3">
                <p className="text-xs text-ink-subtle">
                  Page {meta.current_page} of {meta.last_page} · {meta.total} redirects
                </p>
                <div className="flex gap-2">
                  <AdminButton variant="secondary" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                    Previous
                  </AdminButton>
                  <AdminButton
                    variant="secondary"
                    size="sm"
                    disabled={page >= meta.last_page}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    Next
                  </AdminButton>
                </div>
              </div>
            )}
          </div>
        )}
      </Panel>
    </div>
  );
}

function NewRedirectForm({
  pending,
  onSubmit,
}: {
  pending: boolean;
  onSubmit: (input: { from_path: string; to_path: string; status_code: number }) => void;
}) {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [code, setCode] = useState(301);

  return (
    <form
      className="flex flex-wrap items-end gap-3"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({ from_path: from.trim(), to_path: to.trim(), status_code: code });
        setFrom('');
        setTo('');
      }}
    >
      <label className="flex flex-col gap-1 text-xs font-medium text-ink">
        From path
        <TextInput
          className="h-10 w-56 font-mono text-xs"
          placeholder="/old-url"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          required
        />
      </label>
      <label className="flex flex-col gap-1 text-xs font-medium text-ink">
        To path
        <TextInput
          className="h-10 w-56 font-mono text-xs"
          placeholder="/new-url"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          required
        />
      </label>
      <label className="flex flex-col gap-1 text-xs font-medium text-ink">
        Code
        <Select className="h-10 w-24" value={code} onChange={(e) => setCode(Number(e.target.value))}>
          {CODES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </Select>
      </label>
      <AdminButton type="submit" loading={pending} iconLeft={<Plus className="size-4" />}>
        Add
      </AdminButton>
    </form>
  );
}
