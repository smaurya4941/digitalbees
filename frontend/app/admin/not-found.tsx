import Link from 'next/link';
import { EmptyState } from '@/components/admin/ui';

export default function AdminNotFound() {
  return (
    <div className="pt-12">
      <EmptyState
        title="Page not found"
        description="This admin page doesn’t exist or has moved."
        action={
          <Link
            href="/admin"
            className="inline-flex items-center rounded-xl bg-brand-navy px-4 py-2 text-sm font-medium text-white hover:bg-brand-navy-deep"
          >
            Back to dashboard
          </Link>
        }
      />
    </div>
  );
}
