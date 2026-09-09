'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { Pencil } from 'lucide-react';
import { listPages, pageQueryKeys } from '@/lib/admin/pages';
import { AdminButton, EmptyState, PageHeading, Panel, Spinner, StatusPill } from '@/components/admin/ui';

export default function AdminPagesPage() {
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useQuery({
    queryKey: pageQueryKeys.list(page),
    queryFn: ({ signal }) => listPages(page, signal),
  });

  const rows = data?.data ?? [];
  const meta = data?.meta;

  return (
    <div className="space-y-6">
      <PageHeading
        title="Pages"
        description="URL-to-template bindings resolved by the public site."
      />

      <Panel>
        {isLoading ? (
          <Spinner />
        ) : isError ? (
          <EmptyState title="Couldn’t load pages" description="Refresh the page to try again." />
        ) : rows.length === 0 ? (
          <EmptyState title="No pages" description="Pages are seeded from the information architecture." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-sm">
              <thead>
                <tr className="border-b border-hairline text-left text-xs font-semibold uppercase tracking-wide text-ink-subtle">
                  <th className="px-5 py-3">Page</th>
                  <th className="px-5 py-3">Template</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-hairline">
                {rows.map((row) => (
                  <tr key={row.id} className="group transition-colors hover:bg-neutral-50">
                    <td className="px-5 py-3.5">
                      <div className="font-medium text-ink">{row.title || 'Untitled'}</div>
                      <div className="text-xs text-ink-subtle">{row.url_path}</div>
                    </td>
                    <td className="px-5 py-3.5 text-ink-muted">{row.template ?? '—'}</td>
                    <td className="px-5 py-3.5">
                      <StatusPill status={row.status} />
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <Link
                        href={`/admin/pages/${row.id}`}
                        className="grid size-9 place-items-center rounded-lg text-ink-muted hover:bg-neutral-100 hover:text-ink ml-auto"
                        aria-label={`Edit ${row.title}`}
                      >
                        <Pencil className="size-4" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {meta && meta.last_page > 1 && (
              <div className="flex items-center justify-between border-t border-hairline px-5 py-3">
                <p className="text-xs text-ink-subtle">
                  Page {meta.current_page} of {meta.last_page} · {meta.total} pages
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
