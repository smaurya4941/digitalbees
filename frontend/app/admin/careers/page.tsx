'use client';

import { useDeferredValue, useState } from 'react';
import Link from 'next/link';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import {
  type AdminJobPosting,
  type JobStatus,
  JOB_STATUSES,
  careerQueryKeys,
  deleteCareer,
  listCareers,
  setCareerStatus,
} from '@/lib/admin/careers';
import { AdminApiError } from '@/lib/admin/http';
import { useAuth } from '@/components/admin/providers';
import { DataTable } from '@/components/admin/DataTable';
import { Pagination } from '@/components/admin/Pagination';
import { ListToolbar } from '@/components/admin/ListToolbar';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { PageHeading, Select, useToast } from '@/components/admin/ui';

const STATUS_STYLES: Record<JobStatus, string> = {
  draft: 'bg-neutral-100 text-neutral-600',
  open: 'bg-green-50 text-green-700',
  closed: 'bg-red-50 text-red-700',
};

export default function AdminCareersPage() {
  const { can } = useAuth();
  const toast = useToast();
  const queryClient = useQueryClient();

  const [q, setQ] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [pendingDelete, setPendingDelete] = useState<AdminJobPosting | null>(null);

  const dq = useDeferredValue(q);
  const { data, isLoading, isError } = useQuery({
    queryKey: careerQueryKeys.list({ q: dq, status, page }),
    queryFn: ({ signal }) => listCareers({ q: dq, status, page }, signal),
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: careerQueryKeys.all });
  const canEdit = can('content.update');
  const canPublish = can('content.publish');
  const canDelete = can('content.delete');
  const canCreate = can('content.create');

  const statusMutation = useMutation({
    mutationFn: ({ slug, next }: { slug: string; next: JobStatus }) => setCareerStatus(slug, next),
    onSuccess: () => {
      toast.success('Status updated.');
      void invalidate();
    },
    onError: (error) =>
      toast.error(
        error instanceof AdminApiError && error.isForbidden
          ? 'Opening or closing a role needs the content.publish permission.'
          : 'Could not update the status.',
      ),
  });

  const deleteMutation = useMutation({
    mutationFn: (slug: string) => deleteCareer(slug),
    onSuccess: () => {
      toast.success('Role deleted.');
      setPendingDelete(null);
      void invalidate();
    },
    onError: () => {
      toast.error('Could not delete the role.');
      setPendingDelete(null);
    },
  });

  return (
    <div className="space-y-6">
      <PageHeading
        title="Careers"
        description="Open roles shown on the public careers page, and the applications they receive."
        actions={
          canCreate ? (
            <Link
              href="/admin/careers/new"
              className="inline-flex h-11 items-center gap-2 rounded-xl bg-brand-navy px-5 text-sm font-medium text-white shadow-sm hover:bg-brand-navy-deep"
            >
              <Plus className="size-4" /> New role
            </Link>
          ) : undefined
        }
      />

      <ListToolbar
        q={q}
        onQ={(v) => {
          setQ(v);
          setPage(1);
        }}
        status={status}
        onStatus={(v) => {
          setStatus(v);
          setPage(1);
        }}
        statusOptions={JOB_STATUSES.map((s) => ({ value: s, label: s[0].toUpperCase() + s.slice(1) }))}
        placeholder="Search roles"
      />

      <DataTable
        minWidth={820}
        rows={data?.data ?? []}
        rowKey={(row) => row.id}
        isLoading={isLoading}
        isError={isError}
        emptyTitle="No roles match"
        emptyDescription="Adjust the filters, or post a new role."
        columns={[
          {
            key: 'title',
            header: 'Role',
            render: (job) => (
              <>
                <div className="font-medium text-ink">{job.title}</div>
                <div className="text-xs text-ink-subtle">
                  {job.location_name ? `${job.location_name} · ` : ''}
                  {job.employment_type.replace('_', ' ')}
                </div>
              </>
            ),
          },
          {
            key: 'applications',
            header: 'Applications',
            render: (job) =>
              job.applications_count && job.applications_count > 0 ? (
                <Link
                  href={`/admin/careers/${job.slug}/applications`}
                  className="text-sm font-medium text-brand-navy hover:underline"
                >
                  {job.applications_count}
                </Link>
              ) : (
                <span className="text-ink-subtle">0</span>
              ),
          },
          {
            key: 'status',
            header: 'Status',
            render: (job) =>
              canPublish ? (
                <Select
                  aria-label={`Status for ${job.title}`}
                  value={job.status}
                  disabled={statusMutation.isPending}
                  onChange={(e) =>
                    statusMutation.mutate({ slug: job.slug, next: e.target.value as JobStatus })
                  }
                  className="h-9 w-32 text-xs"
                >
                  {JOB_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s[0].toUpperCase() + s.slice(1)}
                    </option>
                  ))}
                </Select>
              ) : (
                <span
                  className={`inline-flex rounded-full px-2 py-1 text-xs font-medium capitalize ${STATUS_STYLES[job.status]}`}
                >
                  {job.status}
                </span>
              ),
          },
          {
            key: 'actions',
            header: 'Actions',
            align: 'right',
            render: (job) => (
              <div className="flex items-center justify-end gap-1">
                {canEdit && (
                  <Link
                    href={`/admin/careers/${job.slug}`}
                    className="grid size-9 place-items-center rounded-lg text-ink-muted hover:bg-neutral-100 hover:text-ink"
                    aria-label={`Edit ${job.title}`}
                  >
                    <Pencil className="size-4" />
                  </Link>
                )}
                {canDelete && (
                  <button
                    onClick={() => setPendingDelete(job)}
                    className="grid size-9 place-items-center rounded-lg text-ink-muted hover:bg-danger-surface hover:text-danger"
                    aria-label={`Delete ${job.title}`}
                  >
                    <Trash2 className="size-4" />
                  </button>
                )}
              </div>
            ),
          },
        ]}
        footer={<Pagination meta={data?.meta} page={page} onPage={setPage} itemLabel="roles" />}
      />

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Delete this role?"
        description={`This removes “${pendingDelete?.title}” and its posting. Applications are kept.`}
        confirmLabel="Delete role"
        pending={deleteMutation.isPending}
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => pendingDelete && deleteMutation.mutate(pendingDelete.slug)}
      />
    </div>
  );
}
