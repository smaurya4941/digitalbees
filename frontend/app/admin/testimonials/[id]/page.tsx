'use client';

import { use } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { getTestimonial, testimonialQueryKeys } from '@/lib/admin/testimonials';
import { AdminApiError } from '@/lib/admin/http';
import { TestimonialForm } from '@/components/admin/TestimonialForm';
import { EmptyState, Panel, Spinner } from '@/components/admin/ui';

export default function EditTestimonialPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const testimonialId = Number(id);

  const { data, isLoading, error } = useQuery({
    queryKey: testimonialQueryKeys.detail(testimonialId),
    queryFn: ({ signal }) => getTestimonial(testimonialId, signal),
    retry: false,
    enabled: Number.isFinite(testimonialId),
  });

  if (isLoading) return <Spinner />;

  if (error instanceof AdminApiError && error.status === 404) {
    return (
      <Panel>
        <EmptyState
          title="Testimonial not found"
          description={`Nothing matches #${id}.`}
          action={
            <Link href="/admin/testimonials" className="text-sm font-medium text-brand-navy hover:underline">
              Back to testimonials
            </Link>
          }
        />
      </Panel>
    );
  }

  if (!data) {
    return (
      <Panel>
        <EmptyState title="Couldn’t load this testimonial" description="Refresh to try again." />
      </Panel>
    );
  }

  return <TestimonialForm testimonial={data} />;
}
