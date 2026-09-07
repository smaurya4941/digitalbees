'use client';

import type { ReactNode } from 'react';
import { Search } from 'lucide-react';
import type { ContentStatus } from '@/lib/admin/types';
import { Select, TextInput } from './ui';

interface ListToolbarProps {
  q: string;
  onQ: (value: string) => void;
  status?: string;
  onStatus?: (value: string) => void;
  /** Override the status filter options (defaults to the content triple). */
  statusOptions?: { value: string; label: string }[];
  placeholder?: string;
  /** Extra controls rendered after the built-in filters. */
  children?: ReactNode;
}

const CONTENT_STATUSES: ContentStatus[] = ['draft', 'published', 'archived'];
const DEFAULT_OPTIONS = CONTENT_STATUSES.map((s) => ({
  value: s,
  label: s[0].toUpperCase() + s.slice(1),
}));

export function ListToolbar({
  q,
  onQ,
  status,
  onStatus,
  statusOptions = DEFAULT_OPTIONS,
  placeholder = 'Search',
  children,
}: ListToolbarProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="relative w-64">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-subtle" />
        <TextInput
          className="h-10 pl-9"
          placeholder={placeholder}
          value={q}
          onChange={(e) => onQ(e.target.value)}
        />
      </div>
      {onStatus && (
        <Select className="h-10 w-40" value={status ?? ''} onChange={(e) => onStatus(e.target.value)}>
          <option value="">All statuses</option>
          {statusOptions.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </Select>
      )}
      {children}
    </div>
  );
}
