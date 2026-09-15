'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Search, X, Loader2 } from 'lucide-react';
import { apiGetClient, ClientApiError } from '@/lib/api/forms';

type SearchHit = {
  type: string;
  title: string;
  excerpt: string | null;
  url: string;
};

const TYPE_LABELS: Record<string, string> = {
  practice: 'Practices',
  industry: 'Industries',
  region: 'Regions',
  technology: 'Technologies',
  case_study: 'Case studies',
  insight: 'Insights',
  resource: 'Resources',
  career: 'Careers',
};

function groupByType(hits: SearchHit[]): Array<[string, SearchHit[]]> {
  const groups = new Map<string, SearchHit[]>();
  for (const hit of hits) {
    const group = groups.get(hit.type) ?? [];
    group.push(hit);
    groups.set(hit.type, group);
  }
  return Array.from(groups.entries());
}

type SearchOverlayProps = {
  open: boolean;
  onClose: () => void;
};

/**
 * Full-screen search overlay (blueprint §30.1): live-as-you-type results
 * grouped by content type. Debounced, client-side — hits the backend
 * directly rather than through the server-only `lib/api/client.ts`.
 */
export function SearchOverlay({ open, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState('');
  const [hits, setHits] = useState<SearchHit[] | null>(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  useEffect(() => {
    if (query.trim().length < 2) return;

    const controller = new AbortController();

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const results = await apiGetClient<SearchHit[]>('search', { q: query }, controller.signal);
        setHits(results);
      } catch (error) {
        if (!(error instanceof ClientApiError)) return;
        setHits([]);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  if (!open) return null;

  const groups = hits ? groupByType(hits) : [];

  return (
    <div className="fixed inset-0 z-[300] bg-brand-navy-deep/95 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Search">
      <div className="mx-auto flex h-full max-w-3xl flex-col px-6 py-16 md:py-24">
        <div className="flex items-center gap-4 border-b border-white/20 pb-4">
          <Search size={24} className="shrink-0 text-white/60" aria-hidden />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(event) => {
              const value = event.target.value;
              setQuery(value);
              if (value.trim().length < 2) setHits(null);
            }}
            placeholder="Search practices, industries, case studies…"
            className="w-full bg-transparent text-h4 text-white placeholder:text-white/40 focus:outline-none"
          />
          {loading && <Loader2 size={20} className="shrink-0 animate-spin text-white/60" aria-hidden />}
          <button type="button" onClick={onClose} aria-label="Close search" className="shrink-0 text-white/60 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <div className="mt-8 flex-1 overflow-y-auto">
          {query.trim().length >= 2 && !loading && groups.length === 0 && (
            <div className="text-body-lg text-white/70">
              <p>We couldn&apos;t find a match for that. Try a different term.</p>
              <p className="mt-4">
                Can&apos;t find what you&apos;re looking for?{' '}
                <Link href="/contact-us" onClick={onClose} className="underline hover:text-white">
                  Contact us
                </Link>{' '}
                and we&apos;ll point you in the right direction.
              </p>
            </div>
          )}

          {groups.map(([type, typeHits]) => (
            <div key={type} className="mb-8">
              <h2 className="text-eyebrow uppercase text-brand-gold-soft">{TYPE_LABELS[type] ?? type}</h2>
              <ul className="mt-3 flex flex-col gap-2">
                {typeHits.map((hit) => (
                  <li key={`${hit.type}-${hit.url}`}>
                    <Link
                      href={hit.url}
                      onClick={onClose}
                      className="block rounded-lg px-3 py-2 text-body-lg text-white transition-colors hover:bg-white/10"
                    >
                      <span className="font-semibold">{hit.title}</span>
                      {hit.excerpt && <span className="ml-2 text-white/60">{hit.excerpt}</span>}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
