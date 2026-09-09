'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '@/components/admin/providers';
import { CareerForm } from '@/components/admin/CareerForm';
import { PageHeading, Spinner } from '@/components/admin/ui';

export default function NewCareerPage() {
  const router = useRouter();
  const { can, status } = useAuth();

  useEffect(() => {
    if (status === 'authenticated' && !can('content.create')) {
      router.replace('/admin/careers');
    }
  }, [status, can, router]);

  if (status !== 'authenticated' || !can('content.create')) {
    return <Spinner />;
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
        <PageHeading title="New role" description="Starts as a draft until you open it." />
      </div>
      <CareerForm />
    </div>
  );
}
