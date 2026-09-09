'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { ArrowRight } from 'lucide-react';
import { getReviewQueue, workflowQueryKeys } from '@/lib/admin/workflow';
import { useAuth } from '@/components/admin/providers';
import { EmptyState, PageHeading, Panel, Spinner } from '@/components/admin/ui';

export default function ReviewQueuePage() {
  const { can } = useAuth();
  const canReview = can('content.approve');

  const { data, isLoading, isError } = useQuery({
    queryKey: workflowQueryKeys.queue,
    queryFn: ({ signal }) => getReviewQueue(signal),
    enabled: canReview,
  });

  if (!canReview) {
    return (
      <EmptyState
        title="Access denied"
        description="You need the content.approve permission to review submitted content."
      />
    );
  }

  const rows = data?.data ?? [];

  return (
    <div className="space-y-6">
      <PageHeading
        title="Review queue"
        description="Content that authors have submitted and is waiting for your approval."
      />

      <Panel>
        {isLoading ? (
          <Spinner />
        ) : isError ? (
          <EmptyState title="Couldn’t load the queue" description="Refresh to try again." />
        ) : rows.length === 0 ? (
          <EmptyState title="Nothing waiting" description="Every submission has been reviewed." />
        ) : (
          <ul className="divide-y divide-hairline">
            {rows.map((item) => (
              <li key={`${item.type}:${item.slug}`}>
                <Link
                  href={`/admin/${item.type}/${item.slug}`}
                  className="flex items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-neutral-50"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-ink">{item.title}</p>
                    <p className="mt-0.5 text-xs text-ink-subtle">
                      <span className="capitalize">{item.type.replace('-', ' ')}</span>
                      {item.submitted_by && ` · submitted by ${item.submitted_by}`}
                      {item.submitted_at &&
                        ` · ${dayjs(item.submitted_at).format('MMM D, YYYY h:mm A')}`}
                    </p>
                  </div>
                  <ArrowRight className="size-4 shrink-0 text-ink-subtle" aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </div>
  );
}
