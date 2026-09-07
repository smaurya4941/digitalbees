'use client';

import { use } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import { getResource, resourceQueryKeys } from '@/lib/admin/resources';
import { AdminApiError } from '@/lib/admin/http';
import { ResourceForm } from '@/components/admin/ResourceForm';
import { SeoPanel } from '@/components/admin/SeoPanel';
import { RevisionHistory } from '@/components/admin/RevisionHistory';
import { EmptyState, PageHeading, Spinner } from '@/components/admin/ui';

export default function EditResourcePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);

  const { data, isLoading, error } = useQuery({
    queryKey: resourceQueryKeys.detail(slug),
    queryFn: ({ signal }) => getResource(slug, signal),
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
          title="Resource not found"
          description={`Nothing matches “${slug}”.`}
          action={
            <Link href="/admin/resources" className="text-sm font-medium text-brand-navy hover:underline">
              Back to resources
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
          href="/admin/resources"
          className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-ink-muted hover:text-ink"
        >
          <ArrowLeft className="size-4" /> Resources
        </Link>
        <PageHeading title={data.title} description={`/${data.resource_type === 'blog' ? 'insights' : 'resources'}/${data.slug}`} />
      </div>
      <ResourceForm resource={data} />
      <SeoPanel type="resources" slug={data.slug} />
      <RevisionHistory type="resources" slug={data.slug} />
    </div>
  );
}
