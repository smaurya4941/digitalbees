'use client';

import { useState } from 'react';
import { apiPost, ClientApiError } from '@/lib/api/forms';

/**
 * Footer newsletter signup (blueprint §32.2, §28.2): one field, one click,
 * always available on every page — zero-friction by design.
 */
export function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('submitting');
    try {
      await apiPost('newsletter', {
        email,
        source_path: typeof window !== 'undefined' ? window.location.pathname : undefined,
      });
      setStatus('success');
      setEmail('');
    } catch (error) {
      setStatus('error');
      if (!(error instanceof ClientApiError)) throw error;
    }
  }

  if (status === 'success') {
    return <p className="mt-4 text-body-sm text-brand-gold-soft">Thanks — you&apos;re on the list.</p>;
  }

  return (
    <form onSubmit={onSubmit} className="mt-4 flex max-w-xs gap-2">
      <label htmlFor="footer-newsletter-email" className="sr-only">
        Email address
      </label>
      <input
        id="footer-newsletter-email"
        type="email"
        required
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="Your email"
        className="w-full rounded-full border border-white/20 bg-white/5 px-4 py-2 text-body-sm text-ink-inverse outline-none placeholder:text-neutral-400 focus:border-brand-gold"
      />
      <button
        type="submit"
        disabled={status === 'submitting'}
        className="shrink-0 rounded-full bg-brand-gold px-4 py-2 text-body-sm font-semibold text-brand-navy-deep transition-colors hover:bg-white disabled:opacity-50"
      >
        {status === 'submitting' ? '…' : 'Subscribe'}
      </button>
      {status === 'error' && <span className="sr-only">Something went wrong. Please try again.</span>}
    </form>
  );
}
