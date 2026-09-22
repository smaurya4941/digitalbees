import { createElement } from 'react';
import type { LucideProps } from 'lucide-react';
import { industryIcon } from '@/lib/industries/visuals';

/** Renders an industry's admin-chosen icon by name (see lib/industries/visuals). */
export function IndustryIcon({ name, ...props }: { name: string | null | undefined } & Omit<LucideProps, 'name'>) {
  return createElement(industryIcon(name), { 'aria-hidden': true, ...props });
}
