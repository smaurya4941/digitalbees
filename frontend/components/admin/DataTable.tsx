'use client';

import type { ReactNode } from 'react';
import { EmptyState, Panel, Spinner } from './ui';
import { cn } from '@/lib/utils/cn';

export interface Column<T> {
  key: string;
  header: ReactNode;
  render: (row: T) => ReactNode;
  align?: 'left' | 'right';
  headerClassName?: string;
  cellClassName?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string | number;
  isLoading?: boolean;
  isError?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  errorTitle?: string;
  minWidth?: number;
  /** Rendered under the table body (e.g. <Pagination />). */
  footer?: ReactNode;
}

export function DataTable<T>({
  columns,
  rows,
  rowKey,
  isLoading,
  isError,
  emptyTitle = 'Nothing here yet',
  emptyDescription = 'Create the first record to get started.',
  errorTitle = 'Couldn’t load this list',
  minWidth = 640,
  footer,
}: DataTableProps<T>) {
  return (
    <Panel>
      {isLoading ? (
        <Spinner />
      ) : isError ? (
        <EmptyState title={errorTitle} description="Refresh the page to try again." />
      ) : rows.length === 0 ? (
        <EmptyState title={emptyTitle} description={emptyDescription} />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm" style={{ minWidth }}>
            <thead>
              <tr className="border-b border-hairline text-left text-xs font-semibold uppercase tracking-wide text-ink-subtle">
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className={cn(
                      'px-5 py-3',
                      col.align === 'right' && 'text-right',
                      col.headerClassName,
                    )}
                  >
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-hairline">
              {rows.map((row) => (
                <tr key={rowKey(row)} className="group transition-colors hover:bg-neutral-50">
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={cn(
                        'px-5 py-3.5',
                        col.align === 'right' && 'text-right',
                        col.cellClassName,
                      )}
                    >
                      {col.render(row)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          {footer}
        </div>
      )}
    </Panel>
  );
}
