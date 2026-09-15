import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

/**
 * Our type scale lives in `@theme` as custom `--text-*` tokens (see
 * styles/tokens/typography.css), so classes like `text-h2` are font sizes.
 * tailwind-merge cannot know that: with its default config it reads any
 * unknown `text-*` class as a text *colour*, so `cn('text-h2', 'text-ink')`
 * treated the two as conflicting and dropped the size — headings silently
 * rendered at the inherited 16px. Registering the scale here fixes every
 * call site at once.
 *
 * Keep this list in sync with the `--text-*` tokens in tokens/typography.css.
 */
const FONT_SIZE_TOKENS = [
  'display-lg',
  'display-md',
  'headline-xl',
  'headline-lg',
  'headline-lg-mobile',
  'h1',
  'h2',
  'h3',
  'h4',
  'title-md',
  'body-lg',
  'body-md',
  'body-sm',
  'caption',
  'eyebrow',
  'label-sm',
  'button',
  'nav',
] as const;

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [{ text: [...FONT_SIZE_TOKENS] }],
    },
  },
});

/**
 * Merge conditional class lists and resolve Tailwind conflicts
 * (last utility of a given property wins).
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
