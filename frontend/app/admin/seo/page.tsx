'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { AlertTriangle } from 'lucide-react';
import { type SeoIssue, listSeoIssues, seoQueryKeys } from '@/lib/admin/seo';
import { useAuth } from '@/components/admin/providers';
import { EmptyState, PageHeading, Panel, Spinner } from '@/components/admin/ui';

const TYPE_HREF: Record<string, string> = {
  practices: '/admin/practices',
  industries: '/admin/industries',
  regions: '/admin/regions',
  technologies: '/admin/technologies',
  'case-studies': '/admin/case-studies',
};

export default function AdminSeoPage() {
  const { can } = useAuth();
  const canView = can('seo.update');

  const { data, isLoading, isError } = useQuery({
    queryKey: seoQueryKeys.issues,
    queryFn: ({ signal }) => listSeoIssues(signal),
    enabled: canView,
  });

  if (!canView) {
    return <EmptyState title="Access denied" description="You do not have permission to view the SEO report." />;
  }

  const issues = data?.data ?? [];

  return (
    <div className="space-y-6">
      <PageHeading
        title="SEO health"
        description="Published pages with missing or out-of-range metadata."
      />

      {isLoading ? (
        <Spinner />
      ) : isError ? (
        <EmptyState title="Couldn’t load the report" description="Refresh the page to try again." />
      ) : issues.length === 0 ? (
        <EmptyState title="All clear" description="Every published page has complete SEO metadata." />
      ) : (
        <div className="space-y-3">
          {issues.map((issue: SeoIssue) => (
            <Panel key={`${issue.type}/${issue.slug}`} className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-ink">{issue.title}</p>
                  <p className="text-xs text-ink-subtle">{issue.href}</p>
                </div>
                {TYPE_HREF[issue.type] && (
                  <Link
                    href={`${TYPE_HREF[issue.type]}/${issue.slug}`}
                    className="shrink-0 text-xs font-medium text-brand-navy hover:underline"
                  >
                    Fix
                  </Link>
                )}
              </div>
              <ul className="mt-3 space-y-1 text-xs">
                {issue.warnings.map((w, i) => (
                  <li
                    key={i}
                    className={`flex items-start gap-2 ${
                      w.level === 'error' ? 'text-danger' : 'text-warning-strong'
                    }`}
                  >
                    <AlertTriangle className="mt-0.5 size-3.5 shrink-0" />
                    {w.message}
                  </li>
                ))}
              </ul>
            </Panel>
          ))}
        </div>
      )}
    </div>
  );
}
