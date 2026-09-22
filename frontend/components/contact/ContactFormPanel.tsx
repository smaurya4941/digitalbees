'use client';

import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle2, AlertCircle, Lock, ArrowRight, Clock, Send } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { apiPost, ClientApiError } from '@/lib/api/forms';
import { clientEnv } from '@/config/environment';
import {
  contactSchema,
  pressContactSchema,
  type ContactFormValues,
} from '@/lib/validation/contactSchema';
import { FloatingInput, FloatingSelect, FloatingTextarea } from '@/components/forms/Floating';
import type { PersonaKey } from './PersonaRouter';
import PracticeLeadDispatch from './PracticeLeadDispatch';
import ConsultationScheduler from './ConsultationScheduler';

interface ContactFormPanelProps {
  activePersona: PersonaKey;
  initialPractice?: string;
  initialRegion?: string;
}

const PRACTICES = [
  { slug: 'ai-bees', label: 'AI Bees (LLMs & Agentic Ops)' },
  { slug: 'servicenow-bees', label: 'ServiceNow Bees (ITOM, ITSM, SPM)' },
  { slug: 'energy-bees', label: 'Energy Bees (CTRM, Commodities & Risk)' },
  { slug: 'quality-bees', label: 'Quality Bees (QA, SDET & Reliability)' },
  { slug: 'talent-bees', label: 'Talent Bees (Dedicated Pods & Staff Aug)' },
  { slug: 'digital-bees', label: 'Digital Bees (Cloud & Modernization)' },
  { slug: 'marketing-bees', label: 'Marketing Bees (MarTech & Omnichannel)' },
];

const REGIONAL_NODES = [
  { slug: 'india', label: 'Gurugram Center of Excellence (ODC) · UTC+5:30' },
  { slug: 'usa', label: 'Chicago Delivery Headquarters · UTC-6' },
  { slug: 'singapore', label: 'Singapore APAC Financial Node · UTC+8' },
  { slug: 'uae', label: 'Dubai DIFC Sovereign Hub · UTC+4' },
];

const TIMELINE_OPTIONS = [
  { value: 'immediate', label: 'Immediate deployment (1–2 weeks)' },
  { value: '1-month', label: 'Within 30 days' },
  { value: 'quarter', label: 'Next quarter planning' },
  { value: 'exploratory', label: 'Exploratory / Architecture scoping' },
];

type FormPersona = Exclude<PersonaKey, 'candidate'>;

const MESSAGE_LABEL: Record<FormPersona, string> = {
  hire: 'Role / skillsets & pod requirements',
  delivery: 'Project scope & architecture goals',
  partner: 'Partnership scope & technology alignment',
  press: 'Story details & deadline',
};

const MESSAGE_HINT: Record<FormPersona, string> = {
  hire: 'e.g. 3 senior ServiceNow ITOM developers and 1 architect for our Chicago and Gurugram pods.',
  delivery: 'e.g. Migrating CTRM from legacy Allegro to Endur with real-time risk integration.',
  partner: 'e.g. Integrating our observability engine with ServiceNow ITOM.',
  press: 'e.g. An editorial on enterprise AI adoption in financial services; commentary needed by Friday.',
};

const SUBMIT_LABEL: Record<FormPersona, string> = {
  hire: 'Request Talent Bench Overview',
  delivery: 'Book Strategic Consultation',
  partner: 'Transmit Partnership Proposal',
  press: 'Submit Media Request',
};

export default function ContactFormPanel({
  activePersona,
  initialPractice = 'ai-bees',
  initialRegion = 'india',
}: ContactFormPanelProps) {
  const [timeline, setTimeline] = useState<string>('immediate');
  const [requestNda, setRequestNda] = useState<boolean>(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [submitted, setSubmitted] = useState<{ name: string; email: string } | null>(null);
  const successRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting, isValid },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(activePersona === 'press' ? pressContactSchema : contactSchema),
    // Blueprint §28.1: first validation happens on blur; after that fields validate live, and
    // `isValid` tracks every keystroke so the submit button enables as soon as the form is valid.
    mode: 'onTouched',
    reValidateMode: 'onChange',
    defaultValues: {
      fullName: '',
      email: '',
      company: '',
      phone: '',
      message: '',
      practiceSlug: initialPractice,
      regionSlug: initialRegion,
      companyWebsite: '',
    },
  });

  // The candidate persona routes to careers; it never renders this form, but keep types honest.
  const persona: FormPersona = activePersona === 'candidate' ? 'hire' : activePersona;

  const watchedPractice = useWatch({ control, name: 'practiceSlug' });
  const watchedRegion = useWatch({ control, name: 'regionSlug' });
  const selectedPractice = watchedPractice || initialPractice;
  const selectedRegion = watchedRegion || initialRegion;

  // Move focus to the confirmation so keyboard / screen-reader users land on it.
  useEffect(() => {
    if (submitStatus === 'success') successRef.current?.focus();
  }, [submitStatus]);

  const getSlaMessage = () => {
    switch (activePersona) {
      case 'hire':
        return {
          title: 'Talent Bench Request Dispatched',
          sla: 'Shortlist overview delivered within 1 business day',
          body: 'Your talent requirements have been routed directly to our practice directors. Our technical recruiters are assembling pre-vetted engineer profiles tailored to your stack and regional node.',
        };
      case 'delivery':
        return {
          title: 'Strategic Consultation Dispatched',
          sla: 'Practice Director outreach within 4 business hours',
          body: 'Your delivery inquiry has been dispatched to the accountable practice architect. We will reach out to schedule your solution scoping and preliminary discovery call.',
        };
      case 'partner':
        return {
          title: 'Partnership Inquiry Transmitted',
          sla: 'Turnaround within 2 business hours',
          body: 'Thank you for reaching out to TeamBees Alliances. Your proposal has been transmitted directly to our Strategic Ecosystem & Partnerships desk.',
        };
      case 'press':
        return {
          title: 'Media Inquiry Transmitted',
          sla: 'Communications Desk response within 2 business hours',
          body: 'Your request has been routed to our corporate communications desk. A member of our media relations team will follow up with verified resources or commentary.',
        };
      default:
        return {
          title: 'Inquiry Transmitted',
          sla: 'Response within 4 business hours',
          body: 'We have received your message and routed it to the accountable leadership team.',
        };
    }
  };

  const onSubmit = async (values: ContactFormValues) => {
    setSubmitStatus('idle');
    setErrorMessage('');

    const formType = activePersona === 'hire' || activePersona === 'delivery' ? 'demo_request' : 'contact';

    // Compose rich context into message
    let contextualMessage = values.message ? `${values.message}\n\n` : '';
    contextualMessage += `[Inquiry Metadata]\nObjective: ${activePersona}\nTarget Region: ${selectedRegion}`;
    if (activePersona === 'hire') {
      contextualMessage += `\nTimeline: ${timeline}`;
    }
    if (requestNda) {
      contextualMessage += `\nMutual NDA Requested: YES (Pre-Scoping)`;
    }

    try {
      await apiPost('leads', {
        full_name: values.fullName,
        email: values.email,
        company: values.company || undefined,
        phone: values.phone || undefined,
        message: contextualMessage,
        form_type: formType,
        persona,
        practice_slug: selectedPractice || undefined,
        region_slug: selectedRegion || undefined,
        source_path: typeof window !== 'undefined' ? window.location.pathname : '/contact',
      });

      // Captured before reset() clears the fields — the scheduler pre-fills from these.
      setSubmitted({ name: values.fullName, email: values.email });
      setSubmitStatus('success');
      reset();
    } catch (err) {
      setSubmitStatus('error');
      if (err instanceof ClientApiError && err.isValidationError) {
        setErrorMessage('Please check the highlighted form fields and try again.');
      } else {
        setErrorMessage('Unable to transmit request. Please try again or reach out directly to contact@teambeescorp.com.');
      }
    }
  };

  const sla = getSlaMessage();
  const showScheduler = activePersona === 'delivery' && Boolean(clientEnv.NEXT_PUBLIC_SCHEDULER_URL) && submitted;

  return (
    <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start">
      {/* Left Column: Form Panel (7 cols) */}
      <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-sm sm:p-8 lg:col-span-7">
        {submitStatus === 'success' ? (
          <div ref={successRef} tabIndex={-1} role="status" className="py-8 text-center outline-none sm:py-12">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="h-10 w-10" aria-hidden />
            </div>
            <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-emerald-100/70 px-3 py-1 text-label-sm font-semibold uppercase tracking-wider text-emerald-800">
              <Clock className="h-3.5 w-3.5" aria-hidden />
              SLA Guarantee: {sla.sla}
            </span>
            <h3 className="mt-3 text-headline-lg font-bold text-brand-navy">{sla.title}</h3>
            <p className="mx-auto mt-3 max-w-lg text-body-md leading-relaxed text-ink-muted">{sla.body}</p>

            <div className="mx-auto mt-8 max-w-md rounded-xl border border-neutral-200 bg-[#F8F9FF] p-4 text-left text-xs text-ink-muted">
              <div className="mb-1 font-semibold text-brand-navy">What Happens Next:</div>
              <ul className="list-disc space-y-1 pl-4">
                <li>A confirmation email is on its way to {submitted?.email ?? 'your inbox'}.</li>
                <li>Practice Director review and direct technical outreach.</li>
                <li>Optional mutual NDA execution before exchanging architecture specs.</li>
              </ul>
            </div>

            {showScheduler && submitted && (
              <ConsultationScheduler name={submitted.name} email={submitted.email} />
            )}

            <Button
              type="button"
              variant="tertiary"
              className="mt-8"
              onClick={() => {
                setSubmitStatus('idle');
                setSubmitted(null);
              }}
            >
              Submit Another Inquiry
            </Button>
          </div>
        ) : (
          <div>
            {/* Form Header */}
            <div className="border-b border-neutral-100 pb-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-label-sm font-semibold uppercase tracking-wider text-brand-gold-deep">
                  Step 2 · Enter Details & Scope
                </span>
                <span className="rounded-md bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-800">
                  {sla.sla}
                </span>
              </div>
              <h3 className="mt-1 text-title-md font-bold text-brand-navy">
                {activePersona === 'hire' && 'Talent Bench & Pod Requirements'}
                {activePersona === 'delivery' && 'Strategic Scoping & Consultation'}
                {activePersona === 'partner' && 'Alliance & Ecosystem Proposal'}
                {activePersona === 'press' && 'Media & Thought Leadership Inquiry'}
              </h3>
              <p className="mt-1 text-xs text-ink-muted">
                {activePersona === 'hire' && 'Specify target skillsets, pod sizes, and preferred regional delivery hub.'}
                {activePersona === 'delivery' && 'Share your modernization objectives, target platforms, and timelines.'}
                {activePersona === 'partner' && 'Introduce your organization, joint technology capabilities, and alliance goals.'}
                {activePersona === 'press' && 'Provide publication details, topic requirements, and editorial deadlines.'}
              </p>
            </div>

            {/* Error message — announced immediately */}
            <div aria-live="assertive">
              {submitStatus === 'error' && (
                <div
                  role="alert"
                  className="mt-5 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50/80 p-4 text-body-sm text-red-800"
                >
                  <AlertCircle className="h-5 w-5 shrink-0 text-red-600" aria-hidden />
                  <span>{errorMessage}</span>
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-6 space-y-5">
              <p className="text-caption text-ink-muted">
                Fields marked <span aria-hidden>*</span>
                <span className="sr-only">with an asterisk</span> are required.
              </p>

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
                  label="Enterprise work email"
                  type="email"
                  autoComplete="email"
                  required
                  error={errors.email?.message}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FloatingInput
                  {...register('company')}
                  label={activePersona === 'press' ? 'Publication / media outlet' : 'Company / organization name'}
                  type="text"
                  autoComplete="organization"
                  required={activePersona === 'press'}
                  error={errors.company?.message}
                />
                <FloatingInput
                  {...register('phone')}
                  label="Direct phone (optional)"
                  type="tel"
                  autoComplete="tel"
                  error={errors.phone?.message}
                />
              </div>

              {(activePersona === 'hire' || activePersona === 'delivery') && (
                <FloatingSelect {...register('practiceSlug')} label="Accountable practice domain" required>
                  {PRACTICES.map((p) => (
                    <option key={p.slug} value={p.slug}>
                      {p.label}
                    </option>
                  ))}
                </FloatingSelect>
              )}

              {(activePersona === 'hire' || activePersona === 'delivery') && (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FloatingSelect {...register('regionSlug')} label="Target delivery node">
                    {REGIONAL_NODES.map((r) => (
                      <option key={r.slug} value={r.slug}>
                        {r.label}
                      </option>
                    ))}
                  </FloatingSelect>

                  {activePersona === 'hire' && (
                    <FloatingSelect
                      label="Target deployment timeline"
                      value={timeline}
                      onChange={(e) => setTimeline(e.target.value)}
                    >
                      {TIMELINE_OPTIONS.map((t) => (
                        <option key={t.value} value={t.value}>
                          {t.label}
                        </option>
                      ))}
                    </FloatingSelect>
                  )}
                </div>
              )}

              <FloatingTextarea
                {...register('message')}
                label={MESSAGE_LABEL[persona]}
                hint={MESSAGE_HINT[persona]}
                rows={4}
                error={errors.message?.message}
              />

              {/* Pre-scoping NDA Option */}
              <div className="flex items-start gap-2.5 rounded-xl border border-neutral-200/60 bg-[#F8F9FF] p-3.5">
                <input
                  type="checkbox"
                  id="requestNda"
                  checked={requestNda}
                  onChange={(e) => setRequestNda(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-neutral-300 text-brand-navy"
                />
                <label htmlFor="requestNda" className="cursor-pointer text-xs leading-relaxed text-ink-muted">
                  <span className="font-semibold text-brand-navy">Require Mutual NDA execution:</span> Execute a
                  standard mutual NDA before our technical discovery and architecture scoping session.
                </label>
              </div>

              {/* Honeypot field (hidden from legitimate users) */}
              <div className="absolute -left-[9999px]" aria-hidden="true">
                <label htmlFor="company_website">Do not fill this field</label>
                <input
                  {...register('companyWebsite')}
                  id="company_website"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              <div className="pt-2">
                {/* Blueprint §28.1: submit stays disabled until the form is valid. */}
                <Button
                  type="submit"
                  size="lg"
                  disabled={!isValid || isSubmitting}
                  loading={isSubmitting}
                  aria-describedby="submit-hint"
                >
                  <Send className="h-4 w-4 text-brand-gold" aria-hidden />
                  {isSubmitting ? 'Routing to Practice Lead…' : SUBMIT_LABEL[persona]}
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Button>
                <p id="submit-hint" className="mt-2 text-caption text-ink-muted" aria-live="polite">
                  {isValid ? 'Ready to send.' : 'Complete the required fields to enable this button.'}
                </p>

                <div className="mt-3 flex items-center gap-2 text-xs text-ink-muted">
                  <Lock className="h-3.5 w-3.5 shrink-0 text-neutral-500" aria-hidden />
                  <span>
                    SOC2 Type II & GDPR compliant. Your information is never sold. Review our{' '}
                    <Link href="/privacy" className="font-medium underline hover:text-brand-navy">
                      Privacy Policy
                    </Link>
                    .
                  </span>
                </div>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Right Column: Dynamic Dispatch Telemetry (5 cols) */}
      <div className="lg:col-span-5">
        <PracticeLeadDispatch practiceSlug={selectedPractice} regionSlug={selectedRegion} />
      </div>
    </div>
  );
}
