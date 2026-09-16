'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TestimonialForm } from '@/components/admin/TestimonialForm';
import { useAuth } from '@/components/admin/providers';
import { Spinner } from '@/components/admin/ui';

export default function NewTestimonialPage() {
  const router = useRouter();
  const { can, status } = useAuth();

  useEffect(() => {
    if (status === 'authenticated' && !can('content.create')) {
      router.replace('/admin/testimonials');
    }
  }, [status, can, router]);

  if (status !== 'authenticated' || !can('content.create')) return <Spinner />;

  return <TestimonialForm />;
}
