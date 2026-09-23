'use client';

import { useEffect, useState } from 'react';
import type { TocEntry } from '@/types/resource';
import { cn } from '@/lib/utils/cn';

/** "On this page" outline that highlights the section currently in view. */
export function TableOfContents({ entries }: { entries: TocEntry[] }) {
  const [active, setActive] = useState<string | null>(entries[0]?.id ?? null);

  useEffect(() => {
    const headings = entries
      .map((e) => document.getElementById(e.id))
      .filter((el): el is HTMLElement => el !== null);
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (records) => {
        const visible = records.filter((r) => r.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      // Treat a heading as "current" once it passes just below the fixed NavBar.
      { rootMargin: '-120px 0px -65% 0px' },
    );

    headings.forEach((h) => observer.observe(h));
    return () => observer.disconnect();
  }, [entries]);

  if (entries.length < 2) return null;

  return (
    <nav aria-label="On this page">
      <p className="mb-3 text-xs font-bold uppercase tracking-wider text-ink-subtle">On this page</p>
      <ol className="space-y-1 border-l border-neutral-200">
        {entries.map((entry) => (
          <li key={entry.id}>
            <a
              href={`#${entry.id}`}
              aria-current={active === entry.id ? 'location' : undefined}
              className={cn(
                '-ml-px block border-l-2 py-1 text-sm leading-snug transition-colors',
                entry.level === 3 ? 'pl-7' : 'pl-4',
                active === entry.id
                  ? 'border-[#C6963A] font-semibold text-[#0B1F3A]'
                  : 'border-transparent text-ink-muted hover:text-[#0B1F3A]',
              )}
            >
              {entry.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
