'use client';

import { use } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Users } from 'lucide-react';
import { careerQueryKeys, getCareer } from '@/lib/admin/careers';
import { AdminApiError } from '@/lib/admin/http';
import { CareerForm } from '@/components/admin/CareerForm';
import { SeoPanel } from '@/components/admin/SeoPanel';
import { EmptyState, PageHeading, Spinner } from '@/components/admin/ui';

export default function EditCareerPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);

  const { data, isLoading, error } = useQuery({
    queryKey: careerQueryKeys.detail(slug),
    queryFn: ({ signal }) => getCareer(slug, signal),
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
          title="Role not found"
          description={`Nothing matches “${slug}”.`}
          action={
            <Link href="/admin/careers" className="text-sm font-medium text-brand-navy hover:underline">
              Back to careers
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
          href="/admin/careers"
          className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-ink-muted hover:text-ink"
        >
          <ArrowLeft className="size-4" /> Careers
        </Link>
        <PageHeading
          title={data.title}
          description={`/careers/${data.slug}`}
          actions={
            (data.applications_count ?? 0) > 0 ? (
              <Link
                href={`/admin/careers/${data.slug}/applications`}
                className="inline-flex h-11 items-center gap-2 rounded-xl border border-hairline bg-white px-4 text-sm font-medium text-ink hover:bg-neutral-50"
              >
                <Users className="size-4" /> {data.applications_count} applications
              </Link>
            ) : undefined
          }
        />
      </div>
      <CareerForm job={data} />
      <SeoPanel type="careers" slug={data.slug} />
    </div>
  );
}
