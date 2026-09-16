'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaqForm } from '@/components/admin/FaqForm';
import { useAuth } from '@/components/admin/providers';
import { Spinner } from '@/components/admin/ui';

export default function NewFaqPage() {
  const router = useRouter();
  const { can, status } = useAuth();

  useEffect(() => {
    if (status === 'authenticated' && !can('content.create')) {
      router.replace('/admin/faqs');
    }
  }, [status, can, router]);

  if (status !== 'authenticated' || !can('content.create')) return <Spinner />;

  return <FaqForm />;
}
