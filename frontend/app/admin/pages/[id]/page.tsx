'use client';

import { use } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import { getPage, pageQueryKeys } from '@/lib/admin/pages';
import { AdminApiError } from '@/lib/admin/http';
import { PageForm } from '@/components/admin/PageForm';
import { EmptyState, PageHeading, Spinner } from '@/components/admin/ui';

export default function EditPagePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const pageId = Number(id);

  const { data, isLoading, error } = useQuery({
    queryKey: pageQueryKeys.detail(pageId),
    queryFn: ({ signal }) => getPage(pageId, signal),
    retry: (count, err) => !(err instanceof AdminApiError && err.status === 404) && count < 2,
  });

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if ((error instanceof AdminApiError && error.status === 404) || !data) {
    return (
      <div className="pt-12">
        <EmptyState
          title="Page not found"
          description={`No page exists with ID “${id}”.`}
          action={
            <Link href="/admin/pages" className="text-sm font-medium text-brand-navy hover:underline">
              Back to pages
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/pages"
          className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-ink-muted hover:text-ink"
        >
          <ArrowLeft className="size-4" /> Back to pages
        </Link>
        <PageHeading title={data.title || 'Untitled page'} description={data.url_path} />
      </div>
      <PageForm page={data} />
    </div>
  );
}
