'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { ArrowLeft } from 'lucide-react';
import { careerQueryKeys, listApplications } from '@/lib/admin/careers';
import { useAuth } from '@/components/admin/providers';
import { DataTable } from '@/components/admin/DataTable';
import { Pagination } from '@/components/admin/Pagination';
import { EmptyState, PageHeading } from '@/components/admin/ui';

export default function CareerApplicationsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const { can } = useAuth();
  const [page, setPage] = useState(1);

  const canView = can('inquiries.view');

  const { data, isLoading, isError } = useQuery({
    queryKey: careerQueryKeys.applications(slug, page),
    queryFn: ({ signal }) => listApplications(slug, page, signal),
    enabled: canView,
  });

  if (!canView) {
    return <EmptyState title="Access denied" description="You do not have permission to view applications." />;
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          href={`/admin/careers/${slug}`}
          className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-ink-muted hover:text-ink"
        >
          <ArrowLeft className="size-4" /> Back to role
        </Link>
        <PageHeading title="Applications" description={`Candidates who applied to /careers/${slug}`} />
      </div>

      <DataTable
        minWidth={720}
        rows={data?.data ?? []}
        rowKey={(row) => row.id}
        isLoading={isLoading}
        isError={isError}
        emptyTitle="No applications yet"
        emptyDescription="Applications submitted from the public site will appear here."
        columns={[
          {
            key: 'candidate',
            header: 'Candidate',
            render: (a) => (
              <>
                <div className="font-medium text-ink">{a.full_name}</div>
                <div className="text-xs text-ink-subtle">
                  <a href={`mailto:${a.email}`} className="hover:underline">
                    {a.email}
                  </a>
                  {a.phone ? ` · ${a.phone}` : ''}
                </div>
              </>
            ),
          },
          {
            key: 'note',
            header: 'Cover note',
            render: (a) => (
              <span className="line-clamp-2 max-w-md text-ink-muted">{a.cover_note || '—'}</span>
            ),
          },
          {
            key: 'received',
            header: 'Received',
            align: 'right',
            render: (a) => (
              <span className="text-xs text-ink-subtle">
                {a.created_at ? dayjs(a.created_at).format('MMM D, YYYY') : '—'}
              </span>
            ),
          },
        ]}
        footer={<Pagination meta={data?.meta} page={page} onPage={setPage} itemLabel="applications" />}
      />
    </div>
  );
}
