import { createElement } from 'react';
import type { LucideProps } from 'lucide-react';
import { practiceIcon } from '@/lib/practices/visuals';

/** Renders a practice's admin-chosen icon by name (see lib/practices/visuals). */
export function PracticeIcon({ name, ...props }: { name: string | null | undefined } & Omit<LucideProps, 'name'>) {
  return createElement(practiceIcon(name), { 'aria-hidden': true, ...props });
}
