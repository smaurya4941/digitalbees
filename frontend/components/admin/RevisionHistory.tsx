'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { History, RotateCcw } from 'lucide-react';
import {
  type RevisionContentType,
  type RevisionListItem,
  getRevision,
  listRevisions,
  restoreRevision,
  revisionQueryKeys,
} from '@/lib/admin/revisions';
import { AdminApiError } from '@/lib/admin/http';
import { useAuth } from './providers';
import { ConfirmDialog } from './ConfirmDialog';
import { AdminButton, Panel, useToast } from './ui';

function formatValue(value: unknown): string {
  if (value === undefined || value === null || value === '') return '—';
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
}

export function RevisionHistory({ type, slug }: { type: RevisionContentType; slug: string }) {
  const { can } = useAuth();
  const toast = useToast();
  const queryClient = useQueryClient();
  const canRestore = can('content.update');

  const [expanded, setExpanded] = useState<number | null>(null);
  const [confirming, setConfirming] = useState<RevisionListItem | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: revisionQueryKeys.list(type, slug),
    queryFn: ({ signal }) => listRevisions(type, slug, signal),
  });

  const restore = useMutation({
    mutationFn: (id: number) => restoreRevision(type, slug, id),
    onSuccess: () => {
      toast.success('Version restored.');
      setConfirming(null);
      setExpanded(null);
      void queryClient.invalidateQueries({ queryKey: ['admin', type] });
      void queryClient.invalidateQueries({ queryKey: revisionQueryKeys.list(type, slug) });
    },
    onError: (error) =>
      toast.error(
        error instanceof AdminApiError && error.isForbidden
          ? error.message || 'Restoring this version needs the content.publish permission.'
          : 'Could not restore this version.',
      ),
  });

  const revisions = data?.data ?? [];

  return (
    <Panel className="space-y-4 p-6">
      <div className="flex items-center gap-2">
        <History className="size-4 text-ink-subtle" aria-hidden />
        <div>
          <h2 className="text-sm font-semibold text-ink">Version history</h2>
          <p className="mt-0.5 text-xs text-ink-subtle">
            The last {data?.meta.keep ?? 20} saved versions. Restoring one is itself saved as a new
            version.
          </p>
        </div>
      </div>

      {isLoading ? (
        <p className="text-sm text-ink-subtle">Loading…</p>
      ) : revisions.length === 0 ? (
        <p className="text-sm text-ink-subtle">
          No saved versions yet — your next edit will be the first.
        </p>
      ) : (
        <ol className="divide-y divide-hairline">
          {revisions.map((revision) => (
            <li key={revision.id} className="py-3 first:pt-0 last:pb-0">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm text-ink">
                    <span className="font-medium">{revision.author?.name ?? 'System'}</span>{' '}
                    <span className="text-ink-subtle">
                      · {dayjs(revision.created_at).format('MMM D, YYYY h:mm A')}
                    </span>
                  </p>
                  {revision.summary && (
                    <p className="mt-0.5 text-xs text-ink-muted">{revision.summary}</p>
                  )}
                  {revision.changed_fields.length > 0 && (
                    <div className="mt-1.5 flex flex-wrap gap-1">
                      {revision.changed_fields.slice(0, 6).map((field) => (
                        <span
                          key={field}
                          className="rounded-md bg-neutral-100 px-1.5 py-0.5 text-[11px] font-medium text-ink-muted"
                        >
                          {field}
                        </span>
                      ))}
                      {revision.changed_fields.length > 6 && (
                        <span className="px-1 text-[11px] text-ink-subtle">
                          +{revision.changed_fields.length - 6}
                        </span>
                      )}
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setExpanded((id) => (id === revision.id ? null : revision.id))
                  }
                  className="shrink-0 text-xs font-medium text-brand-navy hover:underline"
                >
                  {expanded === revision.id ? 'Hide' : 'Compare'}
                </button>
              </div>

              {expanded === revision.id && (
                <RevisionDiff
                  type={type}
                  slug={slug}
                  id={revision.id}
                  canRestore={canRestore}
                  onRestore={() => setConfirming(revision)}
                />
              )}
            </li>
          ))}
        </ol>
      )}

      <ConfirmDialog
        open={confirming !== null}
        title="Restore this version?"
        description={
          confirming
            ? `The current content will be replaced with the version from ${dayjs(
                confirming.created_at,
              ).format('MMM D, YYYY h:mm A')}. This is saved as a new version, so nothing is lost.`
            : undefined
        }
        confirmLabel="Restore"
        variant="primary"
        pending={restore.isPending}
        onCancel={() => setConfirming(null)}
        onConfirm={() => confirming && restore.mutate(confirming.id)}
      />
    </Panel>
  );
}

function RevisionDiff({
  type,
  slug,
  id,
  canRestore,
  onRestore,
}: {
  type: RevisionContentType;
  slug: string;
  id: number;
  canRestore: boolean;
  onRestore: () => void;
}) {
  const { data, isLoading } = useQuery({
    queryKey: revisionQueryKeys.detail(type, slug, id),
    queryFn: ({ signal }) => getRevision(type, slug, id, signal),
  });

  if (isLoading || !data) {
    return <p className="mt-3 text-xs text-ink-subtle">Loading changes…</p>;
  }

  const keys = Array.from(
    new Set([...Object.keys(data.revision.fields), ...Object.keys(data.current.fields)]),
  )
    .filter((key) => formatValue(data.revision.fields[key]) !== formatValue(data.current.fields[key]))
    .sort();

  return (
    <div className="mt-3 rounded-lg bg-neutral-50 p-3">
      {keys.length === 0 ? (
        <p className="text-xs text-ink-subtle">This version is identical to the current content.</p>
      ) : (
        <dl className="grid gap-2 text-xs">
          {keys.map((key) => (
            <div key={key} className="grid grid-cols-[110px_1fr] gap-3">
              <dt className="font-semibold text-ink-muted">{key}</dt>
              <dd className="min-w-0 break-words font-mono">
                <span className="text-green-700">{formatValue(data.revision.fields[key])}</span>
                <span className="mx-1.5 text-ink-subtle">←</span>
                <span className="text-red-600 line-through">
                  {formatValue(data.current.fields[key])}
                </span>
              </dd>
            </div>
          ))}
        </dl>
      )}

      {canRestore && (
        <div className="mt-3 flex justify-end">
          <AdminButton type="button" size="sm" variant="secondary" iconLeft={<RotateCcw className="size-3.5" />} onClick={onRestore}>
            Restore this version
          </AdminButton>
        </div>
      )}
    </div>
  );
}
