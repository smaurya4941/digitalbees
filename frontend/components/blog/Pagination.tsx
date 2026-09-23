import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

/** Page numbers to show: first, last, current ±1, with gaps as `null`. */
function pageWindow(current: number, last: number): (number | null)[] {
  const pages = new Set([1, last, current - 1, current, current + 1]);
  const sorted = [...pages].filter((p) => p >= 1 && p <= last).sort((a, b) => a - b);
  const out: (number | null)[] = [];
  sorted.forEach((p, i) => {
    if (i > 0 && p - sorted[i - 1]! > 1) out.push(null);
    out.push(p);
  });
  return out;
}

/**
 * Link-based pagination (crawlable, works without JS). `params` carries the
 * active filters so they survive page changes.
 */
export function Pagination({
  basePath,
  page,
  lastPage,
  params = {},
}: {
  basePath: string;
  page: number;
  lastPage: number;
  params?: Record<string, string | undefined>;
}) {
  if (lastPage <= 1) return null;

  const href = (target: number) => {
    const search = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) if (value) search.set(key, value);
    if (target > 1) search.set('page', String(target));
    const qs = search.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  };

  const cell = 'flex h-10 min-w-10 items-center justify-center rounded-xl px-3 text-sm font-semibold transition-colors';

  return (
    <nav aria-label="Pagination" className="mt-12 flex items-center justify-center gap-1.5">
      {page > 1 ? (
        <Link href={href(page - 1)} rel="prev" className={cn(cell, 'border border-neutral-200 bg-white hover:border-[#C6963A]/60')}>
          <ChevronLeft className="h-4 w-4" aria-hidden />
          <span className="sr-only sm:not-sr-only sm:ml-1">Previous</span>
        </Link>
      ) : null}

      {pageWindow(page, lastPage).map((p, i) =>
        p === null ? (
          <span key={`gap-${i}`} className="px-1 text-ink-subtle" aria-hidden>
            …
          </span>
        ) : (
          <Link
            key={p}
            href={href(p)}
            aria-current={p === page ? 'page' : undefined}
            className={cn(
              cell,
              p === page ? 'bg-[#0B1F3A] text-white' : 'border border-neutral-200 bg-white hover:border-[#C6963A]/60',
            )}
          >
            {p}
          </Link>
        ),
      )}

      {page < lastPage ? (
        <Link href={href(page + 1)} rel="next" className={cn(cell, 'border border-neutral-200 bg-white hover:border-[#C6963A]/60')}>
          <span className="sr-only sm:not-sr-only sm:mr-1">Next</span>
          <ChevronRight className="h-4 w-4" aria-hidden />
        </Link>
      ) : null}
    </nav>
  );
}
