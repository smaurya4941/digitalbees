import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { clientEnv } from '@/config/environment';
import type { Breadcrumb } from '@/types/seo';
import { JsonLd } from '@/components/seo/JsonLd';

type BreadcrumbsProps = {
  items: Breadcrumb[];
  className?: string;
};

/**
 * Content-hierarchy breadcrumbs + matching `BreadcrumbList` JSON-LD.
 * `items` always starts with Home and ends with the current page (no link on
 * the last crumb). Generated from the IA, never hand-authored per page.
 */
export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  if (items.length < 2) return null;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((crumb, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: crumb.label,
      item: new URL(crumb.href, clientEnv.NEXT_PUBLIC_SITE_URL).toString(),
    })),
  };

  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex flex-wrap items-center gap-1.5 text-caption text-ink-subtle">
        {items.map((crumb, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={crumb.href} className="flex items-center gap-1.5">
              {isLast ? (
                <span aria-current="page" className="text-ink-muted">
                  {crumb.label}
                </span>
              ) : (
                <Link
                  href={crumb.href}
                  className="rounded-sm hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
                >
                  {crumb.label}
                </Link>
              )}
              {!isLast && <ChevronRight size={14} strokeWidth={1.5} aria-hidden />}
            </li>
          );
        })}
      </ol>
      <JsonLd data={jsonLd} />
    </nav>
  );
}
