'use client';

import { useDeferredValue, useState } from 'react';
import Link from 'next/link';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AdminApiError } from '@/lib/admin/http';
import type { AdminTestimonial, TaxonomyListFilters, TestimonialStatus } from '@/lib/admin/types';
import {
  deleteTestimonial,
  listTestimonials,
  setTestimonialStatus,
  testimonialQueryKeys,
} from '@/lib/admin/testimonials';
import { useAuth } from '@/components/admin/providers';
import { type Column, DataTable } from '@/components/admin/DataTable';
import { Pagination } from '@/components/admin/Pagination';
import { ListToolbar } from '@/components/admin/ListToolbar';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { PageHeading, Select, StatusPill, useToast } from '@/components/admin/ui';
import { Pencil, Plus, Trash2 } from 'lucide-react';

/**
 * A bespoke list page rather than the shared `TaxonomyListPage`: testimonials
 * have no `slug` (they're quotes, not pages), so every identifier here is
 * `id`, and the status vocabulary is the binary draft/published — not the
 * 3-state ContentStatus every other content type uses.
 */
export default function AdminTestimonialsPage() {
  const { can } = useAuth();
  const toast = useToast();
  const queryClient = useQueryClient();

  const [q, setQ] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [pendingDelete, setPendingDelete] = useState<AdminTestimonial | null>(null);

  const dq = useDeferredValue(q);
  const filters: TaxonomyListFilters = { q: dq, status, page };

  const { data, isLoading, isError } = useQuery({
    queryKey: testimonialQueryKeys.list(filters),
    queryFn: ({ signal }) => listTestimonials(filters, signal),
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: testimonialQueryKeys.all });

  const canEdit = can('content.update');
  const canPublish = can('content.publish');
  const canDelete = can('content.delete');
  const canCreate = can('content.create');

  const statusMutation = useMutation({
    mutationFn: ({ id, next }: { id: number; next: TestimonialStatus }) => setTestimonialStatus(id, next),
    onSuccess: () => {
      toast.success('Status updated.');
      void invalidate();
    },
    onError: (error) =>
      toast.error(
        error instanceof AdminApiError && error.isForbidden
          ? 'You do not have permission to publish content.'
          : 'Could not update the status.',
      ),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteTestimonial(id),
    onSuccess: () => {
      toast.success('Testimonial deleted.');
      setPendingDelete(null);
      void invalidate();
    },
    onError: (error) => {
      toast.error(
        error instanceof AdminApiError && error.isForbidden
          ? 'Only administrators can delete content.'
          : 'Could not delete the record.',
      );
      setPendingDelete(null);
    },
  });

  const columns: Column<AdminTestimonial>[] = [
    {
      key: 'quote',
      header: 'Quote',
      render: (t) => (
        <div className="max-w-sm">
          <p className="line-clamp-2 text-ink">{t.quote}</p>
          <p className="text-xs text-ink-subtle">
            {[t.author_name, t.author_title, t.author_company].filter(Boolean).join(' · ') || 'Anonymized'}
          </p>
        </div>
      ),
    },
    {
      key: 'related_type',
      header: 'Related to',
      render: (t) => <span className="text-ink-muted">{t.related_type ?? '—'}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (t) =>
        canPublish ? (
          <Select
            aria-label={`Status for testimonial ${t.id}`}
            value={t.status}
            disabled={statusMutation.isPending}
            onChange={(e) => statusMutation.mutate({ id: t.id, next: e.target.value as TestimonialStatus })}
            className="h-9 w-32 text-xs"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </Select>
        ) : (
          <StatusPill status={t.status} />
        ),
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: (t) => (
        <div className="flex items-center justify-end gap-1">
          {canEdit && (
            <Link
              href={`/admin/testimonials/${t.id}`}
              className="grid size-9 place-items-center rounded-lg text-ink-muted hover:bg-neutral-100 hover:text-ink"
              aria-label={`Edit testimonial ${t.id}`}
            >
              <Pencil className="size-4" />
            </Link>
          )}
          {canDelete && (
            <button
              onClick={() => setPendingDelete(t)}
              className="grid size-9 place-items-center rounded-lg text-ink-muted hover:bg-danger-surface hover:text-danger"
              aria-label={`Delete testimonial ${t.id}`}
            >
              <Trash2 className="size-4" />
            </button>
          )}
          {!canEdit && !canDelete && <span className="text-xs text-ink-subtle">View only</span>}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeading
        title="Testimonials"
        description="Quotes shown on the homepage, careers, and practice pages."
        actions={
          canCreate ? (
            <Link
              href="/admin/testimonials/new"
              className="inline-flex h-11 items-center gap-2 rounded-xl bg-brand-navy px-5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-brand-navy-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold"
            >
              <Plus className="size-4" /> New testimonial
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
        statusOptions={[
          { value: 'draft', label: 'Draft' },
          { value: 'published', label: 'Published' },
        ]}
        placeholder="Search testimonials"
      />

      <DataTable
        columns={columns}
        rows={data?.data ?? []}
        rowKey={(row) => row.id}
        isLoading={isLoading}
        isError={isError}
        emptyTitle="No testimonials match"
        emptyDescription="Adjust the filters, or create a new record."
        minWidth={720}
        footer={<Pagination meta={data?.meta} page={page} onPage={setPage} itemLabel="testimonials" />}
      />

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Delete this testimonial?"
        description="This removes the quote from every page it appears on. An administrator can restore it from the database, but there is no undo in the UI."
        confirmLabel="Delete testimonial"
        pending={deleteMutation.isPending}
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => pendingDelete && deleteMutation.mutate(pendingDelete.id)}
      />
    </div>
  );
}
