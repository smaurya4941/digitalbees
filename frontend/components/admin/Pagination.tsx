'use client';

import { AdminButton } from './ui';

interface PaginationProps {
  meta: { current_page: number; last_page: number; total: number } | undefined;
  page: number;
  onPage: (page: number) => void;
  itemLabel?: string;
}

export function Pagination({ meta, page, onPage, itemLabel = 'items' }: PaginationProps) {
  if (!meta || meta.last_page <= 1) return null;

  return (
    <div className="flex items-center justify-between border-t border-hairline px-5 py-3">
      <p className="text-xs text-ink-subtle">
        Page {meta.current_page} of {meta.last_page} · {meta.total} {itemLabel}
      </p>
      <div className="flex gap-2">
        <AdminButton
          variant="secondary"
          size="sm"
          disabled={page <= 1}
          onClick={() => onPage(Math.max(1, page - 1))}
        >
          Previous
        </AdminButton>
        <AdminButton
          variant="secondary"
          size="sm"
          disabled={page >= meta.last_page}
          onClick={() => onPage(page + 1)}
        >
          Next
        </AdminButton>
      </div>
    </div>
  );
}
