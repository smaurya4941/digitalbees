'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { getIndustry, industryQueryKeys } from '@/lib/admin/industries';
import { IndustryForm } from '@/components/admin/IndustryForm';
import { EmptyState, Spinner } from '@/components/admin/ui';
import { AdminApiError } from '@/lib/admin/http';

export default function EditIndustryPage() {
  const params = useParams();
  const slug = params.slug as string;

  const { data, isLoading, error } = useQuery({
    queryKey: industryQueryKeys.detail(slug),
    queryFn: ({ signal }) => getIndustry(slug, signal),
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
          title="Industry not found"
          description={`No industry exists with the slug “${slug}”.`}
        />
      </div>
    );
  }

  if (!data) {
    return null; // or a generic error state
  }

  return <IndustryForm industry={data} />;
}
