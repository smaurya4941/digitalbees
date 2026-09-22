'use client';

import { type ReactNode, useDeferredValue, useState } from 'react';
import Link from 'next/link';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { AdminApiError, type AdminPaginated } from '@/lib/admin/http';
import type { ContentStatus, TaxonomyListFilters } from '@/lib/admin/types';
import { useAuth } from './providers';
import { type Column, DataTable } from './DataTable';
import { Pagination } from './Pagination';
import { ListToolbar } from './ListToolbar';
import { ConfirmDialog } from './ConfirmDialog';
import { PageHeading, Select, StatusPill, useToast } from './ui';

interface TaxonomyRow {
  id: number;
  slug: string;
  status: ContentStatus;
}

interface QueryKeys {
  all: readonly unknown[];
  list: (filters: TaxonomyListFilters) => readonly unknown[];
}

const STATUSES: ContentStatus[] = ['draft', 'published', 'archived'];

export function TaxonomyListPage<T extends TaxonomyRow>({
  title,
  description,
  basePath,
  entityLabel,
  queryKeys,
  listFn,
  setStatusFn,
  deleteFn,
  primaryColumn,
  extraColumns = [],
  minWidth = 720,
  extraQuery,
  toolbarExtra,
  belowHeading,
}: {
  title: string;
  description: string;
  basePath: string;
  entityLabel: string;
  queryKeys: QueryKeys;
  listFn: (filters: TaxonomyListFilters, signal?: AbortSignal) => Promise<AdminPaginated<T>>;
  setStatusFn: (slug: string, status: ContentStatus) => Promise<T>;
  deleteFn: (slug: string) => Promise<unknown>;
  primaryColumn: Column<T>;
  extraColumns?: Column<T>[];
  minWidth?: number;
  /** Merged into the list query + query key (e.g. { type }). */
  extraQuery?: Record<string, string | undefined>;
  /** Extra controls rendered in the toolbar (e.g. a type <Select/>). */
  toolbarExtra?: ReactNode;
  /** Rendered between the heading and the toolbar (e.g. view tabs). */
  belowHeading?: ReactNode;
}) {
  const { can } = useAuth();
  const toast = useToast();
  const queryClient = useQueryClient();

  const [q, setQ] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [pendingDelete, setPendingDelete] = useState<T | null>(null);

  const dq = useDeferredValue(q);
  const filters: TaxonomyListFilters = { q: dq, status, page };
  const query = { ...filters, ...(extraQuery ?? {}) };

  const { data, isLoading, isError } = useQuery({
    queryKey: queryKeys.list(query as TaxonomyListFilters),
    queryFn: ({ signal }) => listFn(query as TaxonomyListFilters, signal),
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: queryKeys.all });

  const canEdit = can('content.update');
  const canPublish = can('content.publish');
  const canDelete = can('content.delete');
  const canCreate = can('content.create');

  const statusMutation = useMutation({
    mutationFn: ({ slug, next }: { slug: string; next: ContentStatus }) => setStatusFn(slug, next),
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
    mutationFn: (slug: string) => deleteFn(slug),
    onSuccess: () => {
      toast.success(`${title.replace(/s$/, '')} deleted.`);
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

  const statusColumn: Column<T> = {
    key: 'status',
    header: 'Status',
    render: (row) =>
      canPublish ? (
        <Select
          aria-label={`Status for ${row.slug}`}
          value={row.status}
          disabled={statusMutation.isPending}
          onChange={(e) =>
            statusMutation.mutate({ slug: row.slug, next: e.target.value as ContentStatus })
          }
          className="h-9 w-36 text-xs"
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s[0].toUpperCase() + s.slice(1)}
            </option>
          ))}
        </Select>
      ) : (
        <StatusPill status={row.status} />
      ),
  };

  const actionsColumn: Column<T> = {
    key: 'actions',
    header: 'Actions',
    align: 'right',
    render: (row) => (
      <div className="flex items-center justify-end gap-1">
        {canEdit && (
          <Link
            href={`${basePath}/${row.slug}`}
            className="grid size-9 place-items-center rounded-lg text-ink-muted hover:bg-neutral-100 hover:text-ink"
            aria-label={`Edit ${row.slug}`}
          >
            <Pencil className="size-4" />
          </Link>
        )}
        {canDelete && (
          <button
            onClick={() => setPendingDelete(row)}
            className="grid size-9 place-items-center rounded-lg text-ink-muted hover:bg-danger-surface hover:text-danger"
            aria-label={`Delete ${row.slug}`}
          >
            <Trash2 className="size-4" />
          </button>
        )}
        {!canEdit && !canDelete && <span className="text-xs text-ink-subtle">View only</span>}
      </div>
    ),
  };

  return (
    <div className="space-y-6">
      <PageHeading
        title={title}
        description={description}
        actions={
          canCreate ? (
            <Link
              href={`${basePath}/new`}
              className="inline-flex h-11 items-center gap-2 rounded-xl bg-brand-navy px-5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-brand-navy-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold"
            >
              <Plus className="size-4" /> New {entityLabel}
            </Link>
          ) : undefined
        }
      />

      {belowHeading}

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
        placeholder={`Search ${title.toLowerCase()}`}
      >
        {toolbarExtra}
      </ListToolbar>

      <DataTable
        columns={[primaryColumn, ...extraColumns, statusColumn, actionsColumn]}
        rows={data?.data ?? []}
        rowKey={(row) => row.id}
        isLoading={isLoading}
        isError={isError}
        emptyTitle={`No ${title.toLowerCase()} match`}
        emptyDescription="Adjust the filters, or create a new record."
        minWidth={minWidth}
        footer={
          <Pagination meta={data?.meta} page={page} onPage={setPage} itemLabel={title.toLowerCase()} />
        }
      />

      <ConfirmDialog
        open={pendingDelete !== null}
        title={`Delete this ${entityLabel}?`}
        description={`This removes “${pendingDelete?.slug}” from the website. An administrator can restore it.`}
        confirmLabel={`Delete ${entityLabel}`}
        pending={deleteMutation.isPending}
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => pendingDelete && deleteMutation.mutate(pendingDelete.slug)}
      />
    </div>
  );
}
