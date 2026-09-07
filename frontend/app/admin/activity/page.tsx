'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { auditQueryKeys, listAuditLogs, type AuditEntry } from '@/lib/admin/audit';
import { useAuth } from '@/components/admin/providers';
import {
  AdminButton,
  EmptyState,
  PageHeading,
  Panel,
  Select,
  Spinner,
} from '@/components/admin/ui';

const ENTITY_TYPES = [
  '',
  'practice',
  'sub_service',
  'industry',
  'region',
  'technology',
  'case_study',
  'page',
  'media',
];

const ACTIONS = ['', 'created', 'updated', 'deleted', 'force_deleted', 'restored'];

const ACTION_STYLES: Record<string, string> = {
  created: 'bg-green-50 text-green-700',
  updated: 'bg-blue-50 text-blue-700',
  deleted: 'bg-red-50 text-red-700',
  force_deleted: 'bg-red-50 text-red-700',
  restored: 'bg-neutral-100 text-neutral-700',
};

export default function AdminActivityPage() {
  const { can } = useAuth();
  const [entityType, setEntityType] = useState('');
  const [action, setAction] = useState('');
  const [page, setPage] = useState(1);
  const [expanded, setExpanded] = useState<number | null>(null);

  const canView = can('audit.view');

  const { data, isLoading, isError } = useQuery({
    queryKey: auditQueryKeys.list({ auditable_type: entityType, action, page }),
    queryFn: ({ signal }) =>
      listAuditLogs({ auditable_type: entityType, action, page }, signal),
    enabled: canView,
  });

  if (!canView) {
    return (
      <EmptyState
        title="Access denied"
        description="You do not have permission to view the activity log."
      />
    );
  }

  const rows = data?.data ?? [];
  const meta = data?.meta;

  return (
    <div className="space-y-6">
      <PageHeading
        title="Activity"
        description="Every change made to content in the back office — who, what, and when."
      />

      <div className="flex flex-wrap gap-3">
        <Select
          aria-label="Filter by entity type"
          className="h-10 w-48"
          value={entityType}
          onChange={(e) => {
            setEntityType(e.target.value);
            setPage(1);
          }}
        >
          {ENTITY_TYPES.map((t) => (
            <option key={t} value={t}>
              {t === '' ? 'All entities' : t.replace('_', ' ')}
            </option>
          ))}
        </Select>
        <Select
          aria-label="Filter by action"
          className="h-10 w-40"
          value={action}
          onChange={(e) => {
            setAction(e.target.value);
            setPage(1);
          }}
        >
          {ACTIONS.map((a) => (
            <option key={a} value={a}>
              {a === '' ? 'All actions' : a.replace('_', ' ')}
            </option>
          ))}
        </Select>
      </div>

      <Panel>
        {isLoading ? (
          <Spinner />
        ) : isError ? (
          <EmptyState title="Couldn’t load activity" description="Refresh the page to try again." />
        ) : rows.length === 0 ? (
          <EmptyState title="No activity" description="No changes match the current filters." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-sm">
              <thead>
                <tr className="border-b border-hairline text-left text-xs font-semibold uppercase tracking-wide text-ink-subtle">
                  <th className="px-5 py-3">When</th>
                  <th className="px-5 py-3">Who</th>
                  <th className="px-5 py-3">Action</th>
                  <th className="px-5 py-3">Entity</th>
                  <th className="px-5 py-3 text-right">Changes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-hairline">
                {rows.map((entry) => (
                  <ActivityRow
                    key={entry.id}
                    entry={entry}
                    expanded={expanded === entry.id}
                    onToggle={() => setExpanded((id) => (id === entry.id ? null : entry.id))}
                  />
                ))}
              </tbody>
            </table>

            {meta && meta.last_page > 1 && (
              <div className="flex items-center justify-between border-t border-hairline px-5 py-3">
                <p className="text-xs text-ink-subtle">
                  Page {meta.current_page} of {meta.last_page} · {meta.total} entries
                </p>
                <div className="flex gap-2">
                  <AdminButton
                    variant="secondary"
                    size="sm"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                  >
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

function ActivityRow({
  entry,
  expanded,
  onToggle,
}: {
  entry: AuditEntry;
  expanded: boolean;
  onToggle: () => void;
}) {
  const hasDiff = Boolean(entry.old_values || entry.new_values);
  const keys = Array.from(
    new Set([
      ...Object.keys(entry.old_values ?? {}),
      ...Object.keys(entry.new_values ?? {}),
    ]),
  );

  return (
    <>
      <tr className="transition-colors hover:bg-neutral-50">
        <td className="px-5 py-3.5 whitespace-nowrap text-ink-subtle">
          {dayjs(entry.created_at).format('MMM D, YYYY h:mm A')}
        </td>
        <td className="px-5 py-3.5">
          {entry.user ? (
            <span className="font-medium text-ink">{entry.user.name}</span>
          ) : (
            <span className="text-ink-subtle">System</span>
          )}
        </td>
        <td className="px-5 py-3.5">
          <span
            className={`inline-flex rounded-full px-2 py-1 text-xs font-medium capitalize ${
              ACTION_STYLES[entry.action] ?? 'bg-neutral-100 text-neutral-700'
            }`}
          >
            {entry.action.replace('_', ' ')}
          </span>
        </td>
        <td className="px-5 py-3.5 text-ink-muted">
          <span className="capitalize">{entry.auditable_type.replace('_', ' ')}</span>{' '}
          <span className="text-ink-subtle">#{entry.auditable_id}</span>
        </td>
        <td className="px-5 py-3.5 text-right">
          {hasDiff ? (
            <button
              onClick={onToggle}
              className="text-xs font-medium text-brand-navy hover:underline"
            >
              {expanded ? 'Hide' : `${keys.length} field${keys.length === 1 ? '' : 's'}`}
            </button>
          ) : (
            <span className="text-xs text-ink-subtle">—</span>
          )}
        </td>
      </tr>
      {expanded && hasDiff && (
        <tr className="bg-neutral-50">
          <td colSpan={5} className="px-5 py-4">
            <dl className="grid gap-2 text-xs">
              {keys.map((key) => (
                <div key={key} className="grid grid-cols-[120px_1fr] gap-3">
                  <dt className="font-semibold text-ink-muted">{key}</dt>
                  <dd className="font-mono">
                    <span className="text-red-600 line-through">
                      {formatValue(entry.old_values?.[key])}
                    </span>{' '}
                    <span className="text-green-700">
                      {formatValue(entry.new_values?.[key])}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>
          </td>
        </tr>
      )}
    </>
  );
}

function formatValue(value: unknown): string {
  if (value === undefined) return '∅';
  if (value === null) return 'null';
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
}
