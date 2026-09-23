'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, CheckCircle2, Send } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { apiPost, ClientApiError } from '@/lib/api/forms';
import { contactSchema, type ContactFormValues } from '@/lib/validation/contactSchema';
import { FloatingInput, FloatingSelect, FloatingTextarea } from '@/components/forms/Floating';

/** One selectable practice — the published practices, managed in the admin. */
export interface PracticeOption {
  slug: string;
  name: string;
}

interface ContactFormProps {
  practices?: PracticeOption[];
  email: string;
}

/**
 * The contact form: name, email, optional company / phone / practice, and a
 * message. Posts a `contact` lead; `?practice=<slug>` pre-selects a practice.
 */
export default function ContactForm({ practices = [], email }: ContactFormProps) {
  const searchParams = useSearchParams();
  const requested = searchParams.get('practice') ?? '';
  const initialPractice = practices.some((p) => p.slug === requested) ? requested : '';

  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const successRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    mode: 'onTouched',
    reValidateMode: 'onChange',
    defaultValues: {
      fullName: '',
      email: '',
      company: '',
      phone: '',
      message: '',
      practiceSlug: initialPractice,
      companyWebsite: '',
    },
  });

  // Move focus to the confirmation so keyboard / screen-reader users land on it.
  useEffect(() => {
    if (status === 'success') successRef.current?.focus();
  }, [status]);

  const onSubmit = async (values: ContactFormValues) => {
    setStatus('idle');
    setErrorMessage('');

    try {
      await apiPost('leads', {
        full_name: values.fullName,
        email: values.email,
        company: values.company || undefined,
        phone: values.phone || undefined,
        message: values.message || undefined,
        form_type: 'contact',
        practice_slug: values.practiceSlug || undefined,
        source_path: typeof window !== 'undefined' ? window.location.pathname : '/contact-us',
      });
      setStatus('success');
      reset();
    } catch (err) {
      setStatus('error');
      setErrorMessage(
        err instanceof ClientApiError && err.isValidationError
          ? 'Please check the highlighted fields and try again.'
          : `Something went wrong. Please try again or email us at ${email}.`,
      );
    }
  };

  if (status === 'success') {
    return (
      <div ref={successRef} tabIndex={-1} role="status" className="py-10 text-center outline-none">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
          <CheckCircle2 className="h-8 w-8" aria-hidden />
        </div>
        <h2 className="mt-4 text-title-md font-bold text-brand-navy">Thanks — message received.</h2>
        <p className="mx-auto mt-2 max-w-md text-body-md text-ink-muted">
          We&apos;ll get back to you within one business day.
        </p>
        <Button type="button" variant="tertiary" className="mt-6" onClick={() => setStatus('idle')}>
          Send another message
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <div aria-live="assertive">
        {status === 'error' && (
          <div
            role="alert"
            className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50/80 p-4 text-body-sm text-red-800"
          >
            <AlertCircle className="h-5 w-5 shrink-0 text-red-600" aria-hidden />
            <span>{errorMessage}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FloatingInput
          {...register('fullName')}
          label="Full name"
          type="text"
          autoComplete="name"
          required
          error={errors.fullName?.message}
        />
        <FloatingInput
          {...register('email')}
          label="Work email"
          type="email"
          autoComplete="email"
          required
          error={errors.email?.message}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FloatingInput
          {...register('company')}
          label="Company (optional)"
          type="text"
          autoComplete="organization"
          error={errors.company?.message}
        />
        <FloatingInput
          {...register('phone')}
          label="Phone (optional)"
          type="tel"
          autoComplete="tel"
          error={errors.phone?.message}
        />
      </div>

      {practices.length > 0 && (
        <FloatingSelect {...register('practiceSlug')} label="What can we help with?">
          <option value="">Not sure yet / something else</option>
          {practices.map((p) => (
            <option key={p.slug} value={p.slug}>
              {p.name}
            </option>
          ))}
        </FloatingSelect>
      )}

      <FloatingTextarea {...register('message')} label="Message" rows={5} error={errors.message?.message} />

      {/* Honeypot (hidden from real visitors; the backend rejects it if filled) */}
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label htmlFor="company_website">Do not fill this field</label>
        <input {...register('companyWebsite')} id="company_website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
        <Button type="submit" size="lg" disabled={!isValid || isSubmitting} loading={isSubmitting}>
          <Send className="h-4 w-4 text-brand-gold" aria-hidden />
          {isSubmitting ? 'Sending…' : 'Send message'}
        </Button>
        <p className="text-caption text-ink-muted">
          We never share your details. See our{' '}
          <Link href="/privacy" className="font-medium underline hover:text-brand-navy">
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </form>
  );
}
