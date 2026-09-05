'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { getCaseStudy, caseStudyQueryKeys } from '@/lib/admin/case-studies';
import { CaseStudyForm } from '@/components/admin/CaseStudyForm';
import { EmptyState, Spinner } from '@/components/admin/ui';
import { AdminApiError } from '@/lib/admin/http';

export default function EditCaseStudyPage() {
  const params = useParams();
  const slug = params.slug as string;

  const { data, isLoading, error } = useQuery({
    queryKey: caseStudyQueryKeys.detail(slug),
    queryFn: ({ signal }) => getCaseStudy(slug, signal),
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
          title="Case study not found"
          description={`No case study exists with the slug “${slug}”.`}
        />
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return <CaseStudyForm caseStudy={data} />;
}
