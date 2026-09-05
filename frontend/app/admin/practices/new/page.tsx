'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PracticeForm } from '@/components/admin/PracticeForm';
import { useAuth } from '@/components/admin/providers';
import { Spinner } from '@/components/admin/ui';

export default function NewPracticePage() {
  const router = useRouter();
  const { can, status } = useAuth();

  useEffect(() => {
    if (status === 'authenticated' && !can('content.create')) {
      router.replace('/admin/practices');
    }
  }, [status, can, router]);

  if (status !== 'authenticated' || !can('content.create')) return <Spinner />;

  return <PracticeForm />;
}
