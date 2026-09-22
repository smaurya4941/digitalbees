'use client';

import { useId, useMemo, useRef, useState } from 'react';
import { Check, ChevronDown, Search, X } from 'lucide-react';
import type { RelationOption } from '@/lib/admin/types';
import { cn } from '@/lib/utils/cn';

/**
 * Searchable multi-select for one content-graph edge type (industries,
 * technologies, regions). Selection order is kept — it's the display order
 * on the public practice page. Unpublished options stay pickable but are
 * flagged, since the public site hides them until they go live.
 */
export function RelationPicker({
  label,
  description,
  options,
  value,
  onChange,
  loading,
  emptyHint,
}: {
  label: string;
  description?: string;
  options: RelationOption[];
  value: number[];
  onChange: (ids: number[]) => void;
  loading?: boolean;
  emptyHint?: string;
}) {
  const listId = useId();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const byId = useMemo(() => new Map(options.map((o) => [o.id, o])), [options]);
  const selected = value.map((id) => byId.get(id)).filter((o): o is RelationOption => Boolean(o));

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    return options.filter(
      (o) => !q || o.name.toLowerCase().includes(q) || o.slug.includes(q) || o.hint?.toLowerCase().includes(q),
    );
  }, [options, query]);

  const toggle = (id: number) => {
    onChange(value.includes(id) ? value.filter((v) => v !== id) : [...value, id]);
    setQuery('');
    inputRef.current?.focus();
  };

  return (
    <div className="space-y-2.5">
      <div className="flex items-baseline justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-ink">{label}</p>
          {description && <p className="text-xs text-ink-subtle">{description}</p>}
        </div>
        <span className="shrink-0 text-xs tabular-nums text-ink-subtle">{selected.length} selected</span>
      </div>

      {selected.length > 0 && (
        <ul className="flex flex-wrap gap-1.5" aria-label={`Selected ${label.toLowerCase()}`}>
          {selected.map((o) => (
            <li key={o.id}>
              <span
                className={cn(
                  'inline-flex items-center gap-1 rounded-full border py-1 pl-2.5 pr-1 text-xs font-medium',
                  o.status === 'published'
                    ? 'border-brand-navy/15 bg-brand-navy/[0.04] text-brand-navy'
                    : 'border-warning/30 bg-warning-surface text-warning-strong',
                )}
              >
                {o.name}
                {o.status !== 'published' && <span className="text-[10px] uppercase opacity-80">· {o.status}</span>}
                <button
                  type="button"
                  onClick={() => toggle(o.id)}
                  className="grid size-5 place-items-center rounded-full hover:bg-black/10"
                  aria-label={`Remove ${o.name}`}
                >
                  <X className="size-3" aria-hidden />
                </button>
              </span>
            </li>
          ))}
        </ul>
      )}

      <div className="relative">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-ink-subtle" aria-hidden />
        <input
          ref={inputRef}
          type="text"
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-label={`Add ${label.toLowerCase()}`}
          placeholder={loading ? 'Loading…' : `Search ${label.toLowerCase()}…`}
          disabled={loading}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setActive(0);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 120)}
          onKeyDown={(e) => {
            if (e.key === 'ArrowDown') {
              e.preventDefault();
              setOpen(true);
              setActive((i) => Math.min(i + 1, matches.length - 1));
            } else if (e.key === 'ArrowUp') {
              e.preventDefault();
              setActive((i) => Math.max(i - 1, 0));
            } else if (e.key === 'Enter' && open && matches[active]) {
              e.preventDefault();
              toggle(matches[active].id);
            } else if (e.key === 'Escape') {
              setOpen(false);
            } else if (e.key === 'Backspace' && !query && value.length > 0) {
              onChange(value.slice(0, -1));
            }
          }}
          className="h-11 w-full rounded-xl border border-hairline-strong bg-white pl-10 pr-10 text-sm text-ink placeholder:text-ink-subtle transition-colors focus:border-brand-navy focus:outline-none focus:ring-4 focus:ring-brand-navy/10 disabled:opacity-60"
        />
        <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-ink-subtle" aria-hidden />

        {open && !loading && (
          <ul
            id={listId}
            role="listbox"
            aria-multiselectable="true"
            className="absolute inset-x-0 top-full z-20 mt-1.5 max-h-64 overflow-y-auto rounded-xl border border-hairline bg-white p-1 shadow-lg"
          >
            {matches.length === 0 ? (
              <li className="px-3 py-6 text-center text-xs text-ink-subtle">
                {options.length === 0 ? emptyHint ?? 'Nothing to link yet.' : 'No matches.'}
              </li>
            ) : (
              matches.map((o, i) => {
                const isSelected = value.includes(o.id);
                return (
                  <li
                    key={o.id}
                    role="option"
                    aria-selected={isSelected}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => toggle(o.id)}
                    onMouseEnter={() => setActive(i)}
                    className={cn(
                      'flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-sm',
                      i === active ? 'bg-neutral-100' : '',
                    )}
                  >
                    <span
                      className={cn(
                        'grid size-4 shrink-0 place-items-center rounded border',
                        isSelected ? 'border-brand-navy bg-brand-navy text-white' : 'border-hairline-strong',
                      )}
                    >
                      {isSelected && <Check className="size-3" strokeWidth={3} aria-hidden />}
                    </span>
                    <span className="min-w-0 flex-1 truncate text-ink">{o.name}</span>
                    {o.hint && <span className="shrink-0 truncate text-xs text-ink-subtle">{o.hint}</span>}
                    {o.status !== 'published' && (
                      <span className="shrink-0 rounded-full bg-warning-surface px-2 py-0.5 text-[10px] font-medium capitalize text-warning-strong">
                        {o.status}
                      </span>
                    )}
                  </li>
                );
              })
            )}
          </ul>
        )}
      </div>
    </div>
  );
}
