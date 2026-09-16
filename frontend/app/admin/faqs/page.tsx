'use client';

import { useDeferredValue, useState } from 'react';
import Link from 'next/link';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AdminApiError } from '@/lib/admin/http';
import type { AdminFaq, FaqStatus, TaxonomyListFilters } from '@/lib/admin/types';
import { deleteFaq, faqQueryKeys, listFaqs, setFaqStatus } from '@/lib/admin/faqs';
import { useAuth } from '@/components/admin/providers';
import { type Column, DataTable } from '@/components/admin/DataTable';
import { Pagination } from '@/components/admin/Pagination';
import { ListToolbar } from '@/components/admin/ListToolbar';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { PageHeading, Select, StatusPill, useToast } from '@/components/admin/ui';
import { Pencil, Plus, Trash2 } from 'lucide-react';

const FAQABLE_LABELS: Record<string, string> = {
  practice: 'Practice',
  sub_service: 'Sub-service',
};

/**
 * A bespoke list page rather than the shared `TaxonomyListPage`: an FAQ has
 * no `slug` (it's a question/answer pair, not a page), so every identifier
 * here is `id`, and the status vocabulary is the binary draft/published —
 * not the 3-state ContentStatus every other content type uses. Mirrors
 * AdminTestimonialsPage.
 */
export default function AdminFaqsPage() {
  const { can } = useAuth();
  const toast = useToast();
  const queryClient = useQueryClient();

  const [q, setQ] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [pendingDelete, setPendingDelete] = useState<AdminFaq | null>(null);

  const dq = useDeferredValue(q);
  const filters: TaxonomyListFilters = { q: dq, status, page };

  const { data, isLoading, isError } = useQuery({
    queryKey: faqQueryKeys.list(filters),
    queryFn: ({ signal }) => listFaqs(filters, signal),
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: faqQueryKeys.all });

  const canEdit = can('content.update');
  const canPublish = can('content.publish');
  const canDelete = can('content.delete');
  const canCreate = can('content.create');

  const statusMutation = useMutation({
    mutationFn: ({ id, next }: { id: number; next: FaqStatus }) => setFaqStatus(id, next),
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
    mutationFn: (id: number) => deleteFaq(id),
    onSuccess: () => {
      toast.success('FAQ deleted.');
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

  const columns: Column<AdminFaq>[] = [
    {
      key: 'question',
      header: 'Question',
      render: (f) => (
        <div className="max-w-sm">
          <p className="line-clamp-2 text-ink">{f.question}</p>
          <p className="line-clamp-1 text-xs text-ink-subtle">{f.answer}</p>
        </div>
      ),
    },
    {
      key: 'faqable_type',
      header: 'Attached to',
      render: (f) => (
        <span className="text-ink-muted">
          {f.faqable_type ? `${FAQABLE_LABELS[f.faqable_type] ?? f.faqable_type} #${f.faqable_id}` : '—'}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (f) =>
        canPublish ? (
          <Select
            aria-label={`Status for FAQ ${f.id}`}
            value={f.status}
            disabled={statusMutation.isPending}
            onChange={(e) => statusMutation.mutate({ id: f.id, next: e.target.value as FaqStatus })}
            className="h-9 w-32 text-xs"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </Select>
        ) : (
          <StatusPill status={f.status} />
        ),
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: (f) => (
        <div className="flex items-center justify-end gap-1">
          {canEdit && (
            <Link
              href={`/admin/faqs/${f.id}`}
              className="grid size-9 place-items-center rounded-lg text-ink-muted hover:bg-neutral-100 hover:text-ink"
              aria-label={`Edit FAQ ${f.id}`}
            >
              <Pencil className="size-4" />
            </Link>
          )}
          {canDelete && (
            <button
              onClick={() => setPendingDelete(f)}
              className="grid size-9 place-items-center rounded-lg text-ink-muted hover:bg-danger-surface hover:text-danger"
              aria-label={`Delete FAQ ${f.id}`}
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
        title="FAQs"
        description="Questions and answers shown on practice and sub-service pages."
        actions={
          canCreate ? (
            <Link
              href="/admin/faqs/new"
              className="inline-flex h-11 items-center gap-2 rounded-xl bg-brand-navy px-5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-brand-navy-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold"
            >
              <Plus className="size-4" /> New FAQ
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
        placeholder="Search FAQs"
      />

      <DataTable
        columns={columns}
        rows={data?.data ?? []}
        rowKey={(row) => row.id}
        isLoading={isLoading}
        isError={isError}
        emptyTitle="No FAQs match"
        emptyDescription="Adjust the filters, or create a new record."
        minWidth={720}
        footer={<Pagination meta={data?.meta} page={page} onPage={setPage} itemLabel="FAQs" />}
      />

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Delete this FAQ?"
        description="This removes the question from every page it appears on. An administrator can restore it from the database, but there is no undo in the UI."
        confirmLabel="Delete FAQ"
        pending={deleteMutation.isPending}
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => pendingDelete && deleteMutation.mutate(pendingDelete.id)}
      />
    </div>
  );
}
