'use client';

import { use } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { getFaq, faqQueryKeys } from '@/lib/admin/faqs';
import { AdminApiError } from '@/lib/admin/http';
import { FaqForm } from '@/components/admin/FaqForm';
import { EmptyState, Panel, Spinner } from '@/components/admin/ui';

export default function EditFaqPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const faqId = Number(id);

  const { data, isLoading, error } = useQuery({
    queryKey: faqQueryKeys.detail(faqId),
    queryFn: ({ signal }) => getFaq(faqId, signal),
    retry: false,
    enabled: Number.isFinite(faqId),
  });

  if (isLoading) return <Spinner />;

  if (error instanceof AdminApiError && error.status === 404) {
    return (
      <Panel>
        <EmptyState
          title="FAQ not found"
          description={`Nothing matches #${id}.`}
          action={
            <Link href="/admin/faqs" className="text-sm font-medium text-brand-navy hover:underline">
              Back to FAQs
            </Link>
          }
        />
      </Panel>
    );
  }

  if (!data) {
    return (
      <Panel>
        <EmptyState title="Couldn’t load this FAQ" description="Refresh to try again." />
      </Panel>
    );
  }

  return <FaqForm faq={data} />;
}
