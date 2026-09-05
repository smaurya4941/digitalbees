'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { getTechnology, technologyQueryKeys } from '@/lib/admin/technologies';
import { TechnologyForm } from '@/components/admin/TechnologyForm';
import { EmptyState, Spinner } from '@/components/admin/ui';
import { AdminApiError } from '@/lib/admin/http';

export default function EditTechnologyPage() {
  const params = useParams();
  const slug = params.slug as string;

  const { data, isLoading, error } = useQuery({
    queryKey: technologyQueryKeys.detail(slug),
    queryFn: ({ signal }) => getTechnology(slug, signal),
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
          title="Technology not found"
          description={`No technology exists with the slug “${slug}”.`}
        />
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return <TechnologyForm technology={data} />;
}
