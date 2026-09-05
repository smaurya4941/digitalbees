'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { getRegion, regionQueryKeys } from '@/lib/admin/regions';
import { RegionForm } from '@/components/admin/RegionForm';
import { EmptyState, Spinner } from '@/components/admin/ui';
import { AdminApiError } from '@/lib/admin/http';

export default function EditRegionPage() {
  const params = useParams();
  const slug = params.slug as string;

  const { data, isLoading, error } = useQuery({
    queryKey: regionQueryKeys.detail(slug),
    queryFn: ({ signal }) => getRegion(slug, signal),
    retry: (failureCount, err) => {
      if (err instanceof AdminApiError && err.status === 404) return false;
      return failureCount < 3;
    },
  });

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (error instanceof AdminApiError && error.status === 404) {
    return (
      <div className="pt-12">
        <EmptyState
          title="Region not found"
          description={`No region exists with the slug “${slug}”.`}
        />
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return <RegionForm region={data} />;
}
