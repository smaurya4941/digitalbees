'use client';

import { useEffect } from 'react';
import { AdminApiError } from '@/lib/admin/http';
import { AdminButton, EmptyState } from '@/components/admin/ui';

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const description =
    error instanceof AdminApiError && error.isForbidden
      ? 'You do not have permission to view this.'
      : error.message || 'An unexpected error occurred in the admin panel.';

  return (
    <div className="pt-12">
      <EmptyState
        title="Something went wrong"
        description={description}
        action={<AdminButton onClick={reset}>Try again</AdminButton>}
      />
    </div>
  );
}
