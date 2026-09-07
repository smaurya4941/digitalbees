'use client';

import { use } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import { getLocation, locationQueryKeys } from '@/lib/admin/locations';
import { AdminApiError } from '@/lib/admin/http';
import { LocationForm } from '@/components/admin/LocationForm';
import { SeoPanel } from '@/components/admin/SeoPanel';
import { EmptyState, PageHeading, Spinner } from '@/components/admin/ui';

export default function EditLocationPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);

  const { data, isLoading, error } = useQuery({
    queryKey: locationQueryKeys.detail(slug),
    queryFn: ({ signal }) => getLocation(slug, signal),
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
          title="Office not found"
          description={`Nothing matches “${slug}”.`}
          action={
            <Link href="/admin/locations" className="text-sm font-medium text-brand-navy hover:underline">
              Back to offices
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
          href="/admin/locations"
          className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-ink-muted hover:text-ink"
        >
          <ArrowLeft className="size-4" /> Offices
        </Link>
        <PageHeading title={data.name} description={`/locations/${data.slug}`} />
      </div>
      <LocationForm location={data} />
      <SeoPanel type="locations" slug={data.slug} />
    </div>
  );
}
