'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ExternalLink, RotateCcw, Trash2 } from 'lucide-react';
import {
  deletePractice,
  listPractices,
  listTrashedPractices,
  practiceQueryKeys,
  restorePractice,
  setPracticeStatus,
} from '@/lib/admin/practices';
import { AdminApiError } from '@/lib/admin/http';
import type { AdminPractice, TrashedPractice } from '@/lib/admin/types';
import { TaxonomyListPage } from '@/components/admin/TaxonomyListPage';
import { DataTable } from '@/components/admin/DataTable';
import { useAuth } from '@/components/admin/providers';
import { AdminButton, PageHeading, useToast } from '@/components/admin/ui';
import { practiceColor, tint } from '@/lib/practices/visuals';
import { PracticeIcon } from '@/components/ui/PracticeIcon';
import { cn } from '@/lib/utils/cn';

type View = 'active' | 'trash';

function PracticeIdentity({ practice }: { practice: AdminPractice }) {
  const color = practiceColor(practice.color_token);
  return (
    <div className="flex items-center gap-3">
      <span className="grid size-10 shrink-0 place-items-center rounded-xl" style={{ backgroundColor: tint(color), color }}>
        <PracticeIcon name={practice.icon} className="size-5" />
      </span>
      <div className="min-w-0">
        <div className="truncate font-medium text-ink">{practice.name}</div>
        <div className="truncate text-xs text-ink-subtle">{practice.tagline || `/practices/${practice.slug}`}</div>
      </div>
    </div>
  );
}

function formatDate(iso: string | null | undefined) {
  return iso ? new Date(iso).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }) : '—';
}

export default function AdminPracticesPage() {
  const { can } = useAuth();
  const canSeeTrash = can('content.delete');
  const [view, setView] = useState<View>('active');

  const trash = useQuery({
    queryKey: practiceQueryKeys.trash,
    queryFn: ({ signal }) => listTrashedPractices(signal),
    enabled: canSeeTrash,
  });

  const tabs = canSeeTrash ? (
    <ViewTabs view={view} onView={setView} trashCount={trash.data?.length ?? 0} />
  ) : null;

  if (view === 'trash' && canSeeTrash) {
    return (
      <div className="space-y-6">
        <PageHeading title="Practices" description="Deleted practices stay here until you restore them." />
        {tabs}
        <TrashTable rows={trash.data ?? []} isLoading={trash.isLoading} isError={trash.isError} />
      </div>
    );
  }

  return (
    <TaxonomyListPage<AdminPractice>
      title="Practices"
      description="The service lines shown in the nav, homepage, footer and practice pages."
      basePath="/admin/practices"
      entityLabel="practice"
      queryKeys={practiceQueryKeys}
      listFn={listPractices}
      setStatusFn={setPracticeStatus}
      deleteFn={deletePractice}
      belowHeading={tabs}
      primaryColumn={{
        key: 'name',
        header: 'Practice',
        render: (p) => <PracticeIdentity practice={p} />,
      }}
      extraColumns={[
        {
          key: 'services',
          header: 'Sub-services',
          render: (p) => <span className="tabular-nums">{p.sub_services_count ?? 0}</span>,
        },
        {
          key: 'order',
          header: 'Order',
          render: (p) => <span className="tabular-nums text-ink-muted">{p.sort_order}</span>,
        },
        {
          key: 'updated',
          header: 'Updated',
          render: (p) => <span className="whitespace-nowrap text-ink-muted">{formatDate(p.updated_at)}</span>,
        },
        {
          key: 'live',
          header: <span className="sr-only">Live page</span>,
          render: (p) =>
            p.status === 'published' ? (
              <a
                href={p.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-xs font-medium text-brand-navy hover:underline"
                aria-label={`View ${p.name} on the website`}
              >
                View <ExternalLink className="size-3.5" aria-hidden />
              </a>
            ) : null,
        },
      ]}
      minWidth={900}
    />
  );
}

function ViewTabs({ view, onView, trashCount }: { view: View; onView: (v: View) => void; trashCount: number }) {
  const tab = (value: View, label: string, count?: number) => (
    <button
      type="button"
      role="tab"
      aria-selected={view === value}
      onClick={() => onView(value)}
      className={cn(
        'inline-flex h-9 items-center gap-2 rounded-lg px-3.5 text-sm font-medium transition',
        view === value ? 'bg-white text-ink shadow-sm' : 'text-ink-muted hover:text-ink',
      )}
    >
      {value === 'trash' && <Trash2 className="size-3.5" aria-hidden />}
      {label}
      {count !== undefined && count > 0 && (
        <span className="rounded-full bg-neutral-200 px-1.5 text-[11px] tabular-nums text-ink">{count}</span>
      )}
    </button>
  );
  return (
    <div role="tablist" aria-label="Practice views" className="inline-flex gap-1 rounded-xl bg-neutral-100 p-1">
      {tab('active', 'All practices')}
      {tab('trash', 'Trash', trashCount)}
    </div>
  );
}

function TrashTable({ rows, isLoading, isError }: { rows: TrashedPractice[]; isLoading: boolean; isError: boolean }) {
  const toast = useToast();
  const queryClient = useQueryClient();

  const restore = useMutation({
    mutationFn: (slug: string) => restorePractice(slug),
    onSuccess: (practice) => {
      toast.success(
        practice.status === 'published'
          ? `“${practice.name}” restored and live on the website again.`
          : `“${practice.name}” restored as ${practice.status}.`,
      );
      void queryClient.invalidateQueries({ queryKey: practiceQueryKeys.all });
    },
    onError: (error) =>
      toast.error(
        error instanceof AdminApiError && error.isForbidden
          ? 'Only administrators can restore practices.'
          : 'Could not restore the practice.',
      ),
  });

  return (
    <DataTable
      columns={[
        { key: 'name', header: 'Practice', render: (p) => <PracticeIdentity practice={p} /> },
        {
          key: 'deleted',
          header: 'Deleted',
          render: (p) => <span className="whitespace-nowrap text-ink-muted">{formatDate(p.deleted_at)}</span>,
        },
        {
          key: 'status',
          header: 'Restores as',
          render: (p) => <span className="capitalize text-ink-muted">{p.status}</span>,
        },
        {
          key: 'actions',
          header: 'Actions',
          align: 'right',
          render: (p) => (
            <AdminButton
              type="button"
              variant="secondary"
              size="sm"
              iconLeft={<RotateCcw className="size-4" />}
              loading={restore.isPending && restore.variables === p.slug}
              disabled={restore.isPending}
              onClick={() => restore.mutate(p.slug)}
            >
              Restore
            </AdminButton>
          ),
        },
      ]}
      rows={rows}
      rowKey={(p) => p.id}
      isLoading={isLoading}
      isError={isError}
      emptyTitle="Trash is empty"
      emptyDescription="Deleted practices appear here and can be restored at any time."
      minWidth={640}
    />
  );
}
