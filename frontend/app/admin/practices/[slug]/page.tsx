'use client';

import { use } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { getPractice, practiceQueryKeys } from '@/lib/admin/practices';
import { AdminApiError } from '@/lib/admin/http';
import { PracticeForm } from '@/components/admin/PracticeForm';
import { EmptyState, Panel, Spinner } from '@/components/admin/ui';

export default function EditPracticePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);

  const { data, isLoading, error } = useQuery({
    queryKey: practiceQueryKeys.detail(slug),
    queryFn: ({ signal }) => getPractice(slug, signal),
    retry: false,
  });

  if (isLoading) return <Spinner />;

  if (error instanceof AdminApiError && error.status === 404) {
    return (
      <Panel>
        <EmptyState
          title="Practice not found"
          description={`Nothing matches “${slug}”.`}
          action={
            <Link href="/admin/practices" className="text-sm font-medium text-brand-navy hover:underline">
              Back to practices
            </Link>
          }
        />
      </Panel>
    );
  }

  if (!data) {
    return (
      <Panel>
        <EmptyState title="Couldn’t load this practice" description="Refresh to try again." />
      </Panel>
    );
  }

  return <PracticeForm practice={data} />;
}
