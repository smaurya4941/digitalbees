'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { cn } from '@/lib/utils/cn';
import { Button } from '@/components/ui/Button';
import { apiPost, ClientApiError } from '@/lib/api/forms';
import { siteConfig } from '@/config/site';
import { contactSchema, type ContactFormValues } from '@/lib/validation/contactSchema';

/**
 * Persona-routed contact experience (blueprint §26.4 / §28.2): rather than
 * one generic form, the visitor picks who they are first, which decides the
 * form's copy, which fields it shows, and the `form_type`/`practice_slug`
 * sent to the lead-scoring pipeline. Replaces the old single generic
 * "Request Talent Proposal" form.
 */

type Persona = {
  key: string;
  label: string;
  heading: string;
  description: string;
  formType: 'demo_request' | 'contact';
  showPractice: boolean;
  messagePlaceholder: string;
  submitLabel: string;
};

const PRACTICE_NAMES: Record<(typeof siteConfig.practices)[number], string> = {
  'talent-bees': 'Talent Bees',
  'digital-bees': 'Digital Bees',
  'ai-bees': 'AI Bees',
  'marketing-bees': 'Marketing Bees',
  'quality-bees': 'Quality Bees',
  'servicenow-bees': 'ServiceNow Bees',
  'energy-bees': 'Energy Bees',
};

const PERSONAS: Persona[] = [
  {
    key: 'hire',
    label: "I'm looking to hire talent",
    heading: 'Tell us what you need to hire',
    description: 'We\'ll send a shortlist overview within one business day.',
    formType: 'demo_request',
    showPractice: true,
    messagePlaceholder: 'What roles, skills, or team size are you looking for?',
    submitLabel: 'Request Talent Bench Overview',
  },
  {
    key: 'delivery',
    label: 'I need a delivery partner',
    heading: 'Tell us what you\'re building',
    description: 'We\'ll route you to the right specialist within one business day.',
    formType: 'demo_request',
    showPractice: true,
    messagePlaceholder: 'What outcome are you trying to reach?',
    submitLabel: 'Book a Consultation',
  },
  {
    key: 'partner',
    label: "I'm a vendor / partner",
    heading: 'Tell us about the partnership',
    description: 'A member of our partnerships team will follow up.',
    formType: 'contact',
    showPractice: false,
    messagePlaceholder: 'What kind of partnership are you proposing?',
    submitLabel: 'Send Your Message',
  },
  {
    key: 'press',
    label: 'Press inquiry',
    heading: 'Tell us about your story',
    description: 'Our communications team typically responds within two business days.',
    formType: 'contact',
    showPractice: false,
    messagePlaceholder: 'What are you working on?',
    submitLabel: 'Send Your Message',
  },
];

const inputClass =
  'w-full rounded-xl border border-hairline bg-canvas-sunken px-4 py-3 text-body-md text-ink outline-none transition-shadow placeholder:text-ink-subtle focus:border-brand-navy focus:ring-2 focus:ring-brand-gold-deep';

export function PersonaContactForm() {
  const [persona, setPersona] = useState<Persona>(PERSONAS[0]);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({ resolver: zodResolver(contactSchema) });

  async function onSubmit(values: ContactFormValues) {
    setStatus('idle');
    try {
      await apiPost('leads', {
        full_name: values.fullName,
        email: values.email,
        company: values.company || undefined,
        phone: values.phone || undefined,
        message: values.message || undefined,
        form_type: persona.formType,
        practice_slug: persona.showPractice ? values.practiceSlug || undefined : undefined,
        source_path: typeof window !== 'undefined' ? window.location.pathname : undefined,
      });
      setStatus('success');
      reset();
    } catch (error) {
      setStatus('error');
      if (!(error instanceof ClientApiError)) throw error;
    }
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Persona picker */}
      <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="What brings you here?">
        {PERSONAS.map((p) => (
          <button
            key={p.key}
            type="button"
            role="radio"
            aria-checked={persona.key === p.key}
            onClick={() => {
              setPersona(p);
              setStatus('idle');
            }}
            className={cn(
              'rounded-full border px-4 py-2 text-body-sm font-semibold transition-colors',
              persona.key === p.key
                ? 'border-brand-navy bg-brand-navy text-ink-inverse'
                : 'border-hairline-strong bg-canvas text-ink-muted hover:border-brand-navy hover:text-ink',
            )}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div>
        <h2 className="text-h3 text-ink">{persona.heading}</h2>
        <p className="mt-2 text-body-md text-ink-muted">{persona.description}</p>
      </div>

      {status === 'success' && (
        <div className="rounded-xl border border-success/30 bg-success/10 p-4 text-body-md text-success">
          Thanks — you&apos;re booked in. Check your inbox for a confirmation.
        </div>
      )}
      {status === 'error' && (
        <div className="rounded-xl border border-danger/30 bg-danger/10 p-4 text-body-md text-danger">
          Something went wrong. Please try again, or email {siteConfig.contact.email} directly.
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div>
            <input {...register('fullName')} type="text" placeholder="Full name" className={inputClass} aria-invalid={!!errors.fullName} />
            {errors.fullName && <p className="mt-1 text-body-sm text-danger">{errors.fullName.message}</p>}
          </div>
          <div>
            <input {...register('email')} type="email" placeholder="Work email address" className={inputClass} aria-invalid={!!errors.email} />
            {errors.email && <p className="mt-1 text-body-sm text-danger">{errors.email.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <input {...register('company')} type="text" placeholder="Company name" className={inputClass} />
          {persona.showPractice ? (
            <select {...register('practiceSlug')} defaultValue="" className={cn(inputClass, 'text-ink-muted')}>
              <option value="">Which practice? (optional)</option>
              {siteConfig.practices.map((slug) => (
                <option key={slug} value={slug}>
                  {PRACTICE_NAMES[slug]}
                </option>
              ))}
            </select>
          ) : (
            <input {...register('phone')} type="tel" placeholder="Phone (optional)" className={inputClass} />
          )}
        </div>

        <textarea
          {...register('message')}
          placeholder={persona.messagePlaceholder}
          rows={5}
          className={cn(inputClass, 'resize-y')}
        />

        {/* Honeypot — hidden from real visitors, off-screen not display:none. */}
        <div className="absolute -left-[9999px]" aria-hidden="true">
          <label htmlFor="company_website">Leave this field empty</label>
          <input
            {...register('companyWebsite')}
            id="company_website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        <p className="text-body-sm text-ink-subtle">
          We&apos;ll only use your details to respond to this request. See our{' '}
          <a href="/privacy" className="underline hover:text-ink">
            Privacy Policy
          </a>
          .
        </p>

        <div>
          <Button type="submit" size="lg" loading={isSubmitting}>
            {persona.submitLabel}
          </Button>
        </div>
      </form>
    </div>
  );
}
