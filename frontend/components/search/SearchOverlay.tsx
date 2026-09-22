'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
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
  case_study: 'Case Studies',
  insight: 'Publications',
  resource: 'Resources',
  career: 'Open Jobs',
};

const POPULAR_QUERIES = [
  'ServiceNow ITOM',
  'Openlink Endur',
  'SOC2 Testing',
  '48h IT Staffing',
  'AI Agent Pods',
];

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

export function SearchOverlay({ open, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState('');
  const [hits, setHits] = useState<SearchHit[] | null>(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
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
    if (query.trim().length < 2) {
      setHits(null);
      return;
    }

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
    }, 200);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  if (!open) return null;

  const groups = hits ? groupByType(hits) : [];

  return (
    <div
      className="fixed inset-0 z-[300] bg-[#071527]/98 backdrop-blur-xl flex flex-col text-white animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-label="Search TeamBees Corp Intelligence"
    >
      {/* Top Header Bar */}
      <div className="border-b border-white/10 px-6 py-4 flex items-center justify-between max-w-5xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#C6963A]/20 text-[#C6963A] flex items-center justify-center font-bold">
            <span className="material-symbols-outlined text-[20px]">search</span>
          </div>
          <div>
            <span className="text-[10px] font-mono text-[#C6963A] uppercase tracking-wider block">
              // Global Index
            </span>
            <div className="text-sm font-bold text-white">Search TeamBees Intelligence &amp; Services</div>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono text-white/50">
          <span className="hidden sm:inline px-2 py-1 rounded bg-[#0B1F3A] border border-white/10">
            ESC to exit
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close search"
            className="w-8 h-8 rounded-lg bg-[#0B1F3A] hover:bg-rose-500/20 hover:text-rose-300 text-white/70 flex items-center justify-center border border-white/10 transition"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-4xl mx-auto w-full px-6 py-8 flex-1 overflow-y-auto flex flex-col">
        {/* Large Input Field */}
        <div className="relative flex items-center mb-4">
          <span className="material-symbols-outlined absolute left-5 text-[#C6963A] text-[26px]">
            search
          </span>
          <input
            ref={inputRef}
            type="search"
            aria-label="Search TeamBees"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search practices, industries, case studies, jobs…"
            className="w-full bg-[#0B1F3A]/80 border-2 border-[#C6963A] rounded-2xl py-4 pl-14 pr-24 text-lg md:text-xl text-white placeholder:text-white/40 focus:outline-none shadow-[0_0_30px_rgba(198,150,58,0.2)]"
          />
          {loading ? (
            <div className="absolute right-4 w-5 h-5 border-2 border-[#C6963A] border-t-transparent rounded-full animate-spin" />
          ) : (
            <span className="hidden sm:inline absolute right-4 px-2 py-1 rounded bg-[#071527] text-[#C6963A] text-xs font-mono border border-[#C6963A]/30">
              RETURN ↵
            </span>
          )}
        </div>

        {/* Announces result counts to screen readers as the list changes (WCAG 4.1.3). */}
        <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
          {loading
            ? 'Searching…'
            : query.trim().length >= 2 && hits
              ? hits.length === 0
                ? `No results found for ${query}.`
                : `${hits.length} ${hits.length === 1 ? 'result' : 'results'} found.`
              : ''}
        </div>

        {/* Popular query chips */}
        <div className="flex flex-wrap items-center gap-2 mb-8 text-xs font-mono text-white/50">
          <span>Popular:</span>
          {POPULAR_QUERIES.map((pq) => (
            <button
              key={pq}
              type="button"
              onClick={() => setQuery(pq)}
              className="text-white/80 hover:text-[#C6963A] hover:underline px-1 py-0.5 rounded transition"
            >
              {pq}
            </button>
          ))}
        </div>

        {/* Search Results */}
        <div className="flex-1">
          {query.trim().length >= 2 && !loading && groups.length === 0 && (
            <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/10 text-center max-w-lg mx-auto space-y-4">
              <div className="w-12 h-12 rounded-full bg-[#C6963A]/10 text-[#C6963A] flex items-center justify-center mx-auto">
                <span className="material-symbols-outlined text-[28px]">search_off</span>
              </div>
              <h3 className="text-lg font-bold text-white">No exact match found</h3>
              <p className="text-sm text-white/60">
                We couldn&apos;t find an exact match for &ldquo;{query}&rdquo;. You can consult directly with our solutions architects.
              </p>
              <Link
                href="/contact-us"
                onClick={onClose}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#C6963A] text-[#0B1F3A] font-bold text-xs uppercase tracking-wider hover:opacity-90 transition"
              >
                <span>Book a Consultation</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </Link>
            </div>
          )}

          {groups.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {groups.map(([type, typeHits]) => (
                <div key={type} className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono text-white/50 border-b border-white/10 pb-1">
                    <span className="uppercase text-[#C6963A] font-bold">
                      {TYPE_LABELS[type] ?? type} ({typeHits.length})
                    </span>
                  </div>
                  <div className="space-y-2">
                    {typeHits.map((hit) => (
                      <Link
                        key={`${hit.type}-${hit.url}`}
                        href={hit.url}
                        onClick={onClose}
                        className="block p-3 rounded-lg bg-[#0B1F3A]/60 hover:bg-[#0B1F3A] border border-white/5 hover:border-[#C6963A]/40 transition group"
                      >
                        <div className="font-bold text-xs text-white group-hover:text-[#C6963A] transition">
                          {hit.title}
                        </div>
                        {hit.excerpt && (
                          <p className="text-[11px] text-white/50 mt-1 line-clamp-2">
                            {hit.excerpt}
                          </p>
                        )}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* AI Bee Assistant Fallback Card (When no query or after results) */}
          <div className="mt-8 p-5 rounded-2xl bg-[#C6963A]/10 border border-[#C6963A]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#C6963A] text-[#0B1F3A] flex items-center justify-center font-bold shrink-0">
                <span className="material-symbols-outlined text-[24px]">smart_toy</span>
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Can&apos;t find what you&apos;re looking for?</h4>
                <p className="text-xs text-white/70 mt-0.5">
                  Our Bee Assistant can match your exact enterprise tech stack or draft an RFP spec.
                </p>
              </div>
            </div>
            <Link
              href="/contact-us"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-[#C6963A] hover:bg-[#D4AF37] text-[#0B1F3A] font-bold text-xs tracking-wider uppercase transition whitespace-nowrap text-center shrink-0"
            >
              Ask Bee Assistant →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
