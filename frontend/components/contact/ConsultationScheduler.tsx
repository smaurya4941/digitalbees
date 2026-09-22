'use client';

import { useEffect, useMemo, useState } from 'react';
import { CalendarCheck, ExternalLink } from 'lucide-react';
import { clientEnv } from '@/config/environment';

type ConsultationSchedulerProps = {
  name: string;
  email: string;
  /** Called once when the provider reports a booking (Calendly emits this; others simply never fire it). */
  onBooked?: () => void;
};

/**
 * Inline booking widget for the "Book a Consultation" flow (blueprint §28.2,
 * step 3: date/time via embedded scheduler). Provider-agnostic: any hosted
 * booking page that accepts `name` / `email` query params (Calendly, Cal.com)
 * works, configured through NEXT_PUBLIC_SCHEDULER_URL. The lead has already
 * been captured by the time this renders, so abandoning the scheduler never
 * loses the enquiry.
 */
export function buildSchedulerUrl(base: string, name: string, email: string): string {
  const url = new URL(base);
  if (name) url.searchParams.set('name', name);
  if (email) url.searchParams.set('email', email);
  // Calendly hides its cookie banner / sets layout when told it is embedded.
  url.searchParams.set('embed_type', 'Inline');
  if (typeof window !== 'undefined') url.searchParams.set('embed_domain', window.location.hostname);
  return url.toString();
}

export default function ConsultationScheduler({ name, email, onBooked }: ConsultationSchedulerProps) {
  const base = clientEnv.NEXT_PUBLIC_SCHEDULER_URL;
  const [booked, setBooked] = useState(false);

  const src = useMemo(() => (base ? buildSchedulerUrl(base, name, email) : null), [base, name, email]);

  useEffect(() => {
    if (!base) return;
    const providerOrigin = new URL(base).origin;

    function onMessage(event: MessageEvent) {
      // Only trust the configured provider's origin.
      if (event.origin !== providerOrigin) return;
      const data = event.data as { event?: string } | null;
      if (data?.event === 'calendly.event_scheduled') {
        setBooked(true);
        onBooked?.();
      }
    }

    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [base, onBooked]);

  if (!src) return null;

  return (
    <section aria-labelledby="scheduler-heading" className="mt-8 text-left">
      <div className="flex items-center gap-2">
        <CalendarCheck className="h-5 w-5 text-brand-gold-deep" aria-hidden />
        <h4 id="scheduler-heading" className="text-title-sm font-bold text-brand-navy">
          Step 3 · Pick a time for your consultation
        </h4>
      </div>
      <p className="mt-1 text-body-sm text-ink-muted">
        Optional — your request is already with our team. Choose a slot if you would like to fix a time now.
      </p>

      <div aria-live="polite" className="mt-3">
        {booked && (
          <p role="status" className="rounded-lg bg-success-surface p-3 text-body-sm font-medium text-success-strong">
            You&apos;re booked. A calendar invite is on its way to {email || 'your inbox'}.
          </p>
        )}
      </div>

      <div className="mt-3 overflow-hidden rounded-xl border border-hairline-strong bg-canvas-raised">
        <iframe
          title="Book a consultation time"
          src={src}
          loading="lazy"
          className="h-[720px] w-full border-0"
        />
      </div>

      <a
        href={src}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 inline-flex items-center gap-1.5 text-body-sm font-semibold text-brand-navy underline underline-offset-4 hover:text-brand-gold-deep"
      >
        Open the scheduler in a new tab
        <ExternalLink className="h-4 w-4" aria-hidden />
        <span className="sr-only">(opens in a new tab)</span>
      </a>
    </section>
  );
}
