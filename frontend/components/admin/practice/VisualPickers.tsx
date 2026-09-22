'use client';

import { Check } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { PRACTICE_COLORS, PRACTICE_ICONS, tint, type PracticeColorToken } from '@/lib/practices/visuals';

/**
 * Icon grid for `practices.icon`. Only curated names are offered, so every
 * choice is guaranteed to render on the public site (see lib/practices/visuals).
 */
export function IconPicker({
  value,
  onChange,
  color,
}: {
  value: string | null | undefined;
  onChange: (name: string) => void;
  /** Resolved hex of the selected colour, so the grid previews the real pairing. */
  color: string;
}) {
  return (
    <div role="radiogroup" aria-label="Practice icon" className="grid grid-cols-6 gap-2 sm:grid-cols-10">
      {Object.entries(PRACTICE_ICONS).map(([name, Icon]) => {
        const selected = value === name;
        return (
          <button
            key={name}
            type="button"
            role="radio"
            aria-checked={selected}
            aria-label={name.replace(/-/g, ' ')}
            title={name}
            onClick={() => onChange(name)}
            className={cn(
              'grid aspect-square place-items-center rounded-xl border transition-all',
              'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold',
              selected
                ? 'border-transparent shadow-sm ring-2 ring-offset-1'
                : 'border-hairline text-ink-muted hover:border-hairline-strong hover:bg-neutral-50 hover:text-ink',
            )}
            style={selected ? { backgroundColor: tint(color, 'medium'), color, ['--tw-ring-color' as string]: color } : undefined}
          >
            <Icon className="size-[18px]" aria-hidden />
          </button>
        );
      })}
    </div>
  );
}

/** Swatches for `practices.color_token` — the practice-* tokens from styles/tokens/colors.css. */
export function ColorPicker({
  value,
  onChange,
}: {
  value: string | null | undefined;
  onChange: (token: PracticeColorToken) => void;
}) {
  return (
    <div role="radiogroup" aria-label="Practice colour" className="flex flex-wrap gap-2.5">
      {(Object.entries(PRACTICE_COLORS) as [PracticeColorToken, { label: string; hex: string }][]).map(
        ([token, { label, hex }]) => {
          const selected = value === token;
          return (
            <button
              key={token}
              type="button"
              role="radio"
              aria-checked={selected}
              title={label}
              onClick={() => onChange(token)}
              className={cn(
                'group flex items-center gap-2 rounded-full border py-1.5 pl-1.5 pr-3 text-xs font-medium transition-all',
                'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold',
                selected ? 'border-ink/20 bg-neutral-50 text-ink shadow-sm' : 'border-hairline text-ink-muted hover:border-hairline-strong',
              )}
            >
              <span className="grid size-6 place-items-center rounded-full text-white" style={{ backgroundColor: hex }}>
                {selected && <Check className="size-3.5" strokeWidth={3} aria-hidden />}
              </span>
              {label}
            </button>
          );
        },
      )}
    </div>
  );
}
