'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Paperclip } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { apiPost, ClientApiError } from '@/lib/api/forms';

type ApplicationValues = {
  fullName: string;
  email: string;
  phone: string;
  coverNote: string;
  companyWebsite: string; // honeypot
};

type JobApplicationFormProps = {
  careerSlug: string;
  jobTitle: string;
};

/**
 * Job application form (blueprint §28.2's "Job Application" flow): resume
 * upload parses nothing client-side, but the field IS wired through to
 * `POST /careers/{career}/apply` as multipart/form-data — previously this
 * page only linked "Apply" to the generic contact form, which never called
 * the apply endpoint at all.
 */
export function JobApplicationForm({ careerSlug, jobTitle }: JobApplicationFormProps) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [resume, setResume] = useState<File | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ApplicationValues>();

  async function onSubmit(values: ApplicationValues) {
    setStatus('idle');
    try {
      const formData = new FormData();
      formData.set('full_name', values.fullName);
      formData.set('email', values.email);
      if (values.phone) formData.set('phone', values.phone);
      if (values.coverNote) formData.set('cover_note', values.coverNote);
      if (values.companyWebsite) formData.set('company_website', values.companyWebsite);
      if (resume) formData.set('resume', resume);

      await apiPost(`careers/${careerSlug}/apply`, formData);
      setStatus('success');
      reset();
      setResume(null);
    } catch (error) {
      setStatus('error');
      if (!(error instanceof ClientApiError)) throw error;
    }
  }

  if (!open) {
    return (
      <Button onClick={() => setOpen(true)} size="lg">
        Apply Now
      </Button>
    );
  }

  if (status === 'success') {
    return (
      <div className="rounded-xl border border-success/30 bg-success/10 p-6 text-body-md text-success">
        Application received. Our talent team typically responds within 5 business days — here&apos;s what happens
        next: we&apos;ll review your background against {jobTitle} and reach out if it&apos;s a fit.
      </div>
    );
  }

  const inputClass =
    'w-full rounded-xl border border-hairline bg-canvas-sunken px-4 py-3 text-body-md text-ink outline-none focus:border-brand-navy focus:ring-2 focus:ring-brand-gold-deep';

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4 rounded-2xl border border-hairline bg-canvas p-6">
      <h2 className="text-h4 text-ink">Apply for {jobTitle}</h2>

      {status === 'error' && (
        <div className="rounded-lg border border-danger/30 bg-danger/10 p-3 text-body-sm text-danger">
          Something went wrong submitting your application. Please try again.
        </div>
      )}

      <div>
        <input {...register('fullName', { required: true })} placeholder="Full name" className={inputClass} />
        {errors.fullName && <p className="mt-1 text-body-sm text-danger">Enter your name.</p>}
      </div>
      <div>
        <input {...register('email', { required: true })} type="email" placeholder="Email" className={inputClass} />
        {errors.email && <p className="mt-1 text-body-sm text-danger">Enter your email.</p>}
      </div>
      <input {...register('phone')} type="tel" placeholder="Phone (optional)" className={inputClass} />
      <textarea {...register('coverNote')} placeholder="Anything you'd like us to know? (optional)" rows={4} className={inputClass} />

      <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-hairline-strong px-4 py-3 text-body-sm text-ink-muted hover:border-brand-navy">
        <Paperclip size={18} aria-hidden />
        {resume ? resume.name : 'Attach resume (PDF, DOC, DOCX — 5MB max)'}
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          className="sr-only"
          onChange={(event) => setResume(event.target.files?.[0] ?? null)}
        />
      </label>

      {/* Honeypot */}
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <input {...register('companyWebsite')} tabIndex={-1} autoComplete="off" />
      </div>

      <div className="flex gap-3">
        <Button type="submit" loading={isSubmitting}>
          Submit Application
        </Button>
        <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
