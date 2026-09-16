'use client';

import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Field, TextInput, Textarea } from './ui';
import { cn } from '@/lib/utils/cn';

/**
 * Structured editors for the practice/case-study JSON capability columns
 * (key_stats, key_capabilities, workflow_steps, framework_stack,
 * technical_capabilities, servicenow_fit, how_it_works, capabilities_used —
 * see PracticeDetailResource / CaseStudyDetailResource). These columns are
 * `sometimes array` on the backend with no fixed nested shape validated
 * server-side, so the form layer owns getting the shape right.
 *
 * Two patterns cover every column actually in use:
 *  - ObjectListRepeater: a repeatable card of flat text fields (key_stats,
 *    key_capabilities, workflow_steps all fit this).
 *  - JsonField: a raw JSON editor for the columns with real nesting
 *    (framework_stack's `tools[]`, technical_capabilities' `points`/
 *    `proven_in` arrays, servicenow_fit's two-level shape) — building a
 *    bespoke widget for every nested shape isn't worth it for content this
 *    rarely edited; a validated JSON textarea is the honest, low-maintenance
 *    choice here.
 */

type FieldDef<T> = {
  name: keyof T;
  label: string;
  type?: 'text' | 'textarea' | 'number';
  placeholder?: string;
};

export function ObjectListRepeater<T extends Record<string, unknown>>({
  label,
  hint,
  items,
  onChange,
  fields,
  newItem,
  addLabel = 'Add item',
}: {
  label: string;
  hint?: string;
  items: T[];
  onChange: (items: T[]) => void;
  fields: FieldDef<T>[];
  newItem: () => T;
  addLabel?: string;
}) {
  const update = (index: number, key: keyof T, value: string) => {
    const next = items.slice();
    next[index] = { ...next[index], [key]: value };
    onChange(next);
  };

  const remove = (index: number) => onChange(items.filter((_, i) => i !== index));
  const add = () => onChange([...items, newItem()]);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-ink">{label}</span>
        <button
          type="button"
          onClick={add}
          className="inline-flex items-center gap-1 text-sm font-medium text-brand-navy hover:underline"
        >
          <Plus className="size-3.5" /> {addLabel}
        </button>
      </div>
      {hint && <p className="text-xs text-ink-subtle">{hint}</p>}

      <div className="space-y-3">
        {items.map((item, index) => (
          <div
            key={index}
            className="relative rounded-lg border border-hairline bg-canvas-raised p-4"
          >
            <button
              type="button"
              onClick={() => remove(index)}
              className="absolute right-3 top-3 text-ink-muted hover:text-danger"
              aria-label="Remove item"
            >
              <Trash2 className="size-4" />
            </button>
            <div className={cn('grid gap-3 pr-8', fields.length > 1 && 'sm:grid-cols-2')}>
              {fields.map((f) => (
                <Field key={String(f.name)} label={f.label}>
                  {f.type === 'textarea' ? (
                    <Textarea
                      rows={2}
                      value={String(item[f.name] ?? '')}
                      placeholder={f.placeholder}
                      onChange={(e) => update(index, f.name, e.target.value)}
                    />
                  ) : (
                    <TextInput
                      type={f.type === 'number' ? 'number' : 'text'}
                      value={String(item[f.name] ?? '')}
                      placeholder={f.placeholder}
                      onChange={(e) => update(index, f.name, e.target.value)}
                    />
                  )}
                </Field>
              ))}
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-sm italic text-ink-muted">Nothing added yet.</p>}
      </div>
    </div>
  );
}

export function StringListRepeater({
  label,
  hint,
  items,
  onChange,
  placeholder,
  addLabel = 'Add item',
}: {
  label: string;
  hint?: string;
  items: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
  addLabel?: string;
}) {
  const update = (index: number, value: string) => {
    const next = items.slice();
    next[index] = value;
    onChange(next);
  };

  const remove = (index: number) => onChange(items.filter((_, i) => i !== index));
  const add = () => onChange([...items, '']);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-ink">{label}</span>
        <button
          type="button"
          onClick={add}
          className="inline-flex items-center gap-1 text-sm font-medium text-brand-navy hover:underline"
        >
          <Plus className="size-3.5" /> {addLabel}
        </button>
      </div>
      {hint && <p className="text-xs text-ink-subtle">{hint}</p>}

      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <TextInput
              className="flex-1"
              value={item}
              placeholder={placeholder}
              onChange={(e) => update(index, e.target.value)}
            />
            <button
              type="button"
              onClick={() => remove(index)}
              className="grid size-9 shrink-0 place-items-center rounded-lg text-ink-muted hover:bg-danger-surface hover:text-danger"
              aria-label="Remove item"
            >
              <Trash2 className="size-4" />
            </button>
          </div>
        ))}
        {items.length === 0 && <p className="text-sm italic text-ink-muted">Nothing added yet.</p>}
      </div>
    </div>
  );
}

/** A validated JSON editor for the columns with real nested structure. */
export function JsonField({
  label,
  hint,
  value,
  onChange,
  rows = 8,
  emptyValue = [],
}: {
  label: string;
  hint?: string;
  value: unknown;
  onChange: (value: unknown) => void;
  rows?: number;
  /** Shape to seed the textarea with when `value` is null/undefined — `[]` for list columns, `{}`-shaped for `servicenow_fit`. */
  emptyValue?: unknown;
}) {
  const [text, setText] = useState(() => JSON.stringify(value ?? emptyValue, null, 2));
  const [error, setError] = useState<string | null>(null);

  const handleChange = (next: string) => {
    setText(next);
    if (next.trim() === '') {
      setError(null);
      onChange(null);
      return;
    }
    try {
      const parsed = JSON.parse(next);
      setError(null);
      onChange(parsed);
    } catch {
      setError('Not valid JSON — changes won’t be saved until this is fixed.');
    }
  };

  return (
    <Field label={label} hint={error ? undefined : hint} error={error ?? undefined}>
      <Textarea
        rows={rows}
        className="font-mono text-xs"
        value={text}
        invalid={Boolean(error)}
        onChange={(e) => handleChange(e.target.value)}
      />
    </Field>
  );
}
