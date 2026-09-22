'use client';

import { useCallback, useEffect, useRef, useState, type DragEvent } from 'react';
import { useForm, type Path } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FileText, Paperclip, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { FloatingInput, FloatingTextarea } from '@/components/forms/Floating';
import { apiPost, ClientApiError } from '@/lib/api/forms';
import {
  applicationSchema,
  validateResumeFile,
  type ApplicationValues,
} from '@/lib/validation/applicationSchema';
import { cn } from '@/lib/utils/cn';

type JobApplicationFormProps = {
  careerSlug: string;
  jobTitle: string;
};

type ParsedResume = { full_name?: string; email?: string; phone?: string };
type ParseState = 'idle' | 'reading' | 'filled' | 'nothing' | 'failed';

/** Backend field name -> form field name, for mapping 422 responses back onto inputs. */
const SERVER_FIELD_MAP: Record<string, Path<ApplicationValues>> = {
  full_name: 'fullName',
  email: 'email',
  phone: 'phone',
  cover_note: 'coverNote',
};

/**
 * Job application form (blueprint §28.1 / §28.2): floating-label fields,
 * validation on blur, a submit button that stays disabled until the form is
 * valid, and a drag-and-drop resume that is parsed server-side
 * (`POST /careers/parse-resume`) to pre-fill name / email / phone so nothing
 * already in the CV has to be retyped. Parsing is advisory — it never
 * overwrites what the candidate has already typed, and a failure just leaves
 * the fields for them to fill in.
 */
export function JobApplicationForm({ careerSlug, jobTitle }: JobApplicationFormProps) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [resume, setResume] = useState<File | null>(null);
  const [resumeError, setResumeError] = useState<string | null>(null);
  const [parseState, setParseState] = useState<ParseState>('idle');
  const [filledCount, setFilledCount] = useState(0);
  const [dragging, setDragging] = useState(false);
  const parseAbort = useRef<AbortController | null>(null);
  const successRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    setError,
    getValues,
    formState: { errors, isSubmitting, isValid, dirtyFields },
  } = useForm<ApplicationValues>({
    resolver: zodResolver(applicationSchema),
    mode: 'onTouched',
    reValidateMode: 'onChange',
    defaultValues: { fullName: '', email: '', phone: '', coverNote: '', companyWebsite: '' },
  });

  useEffect(() => {
    if (status === 'success') successRef.current?.focus();
  }, [status]);

  useEffect(() => () => parseAbort.current?.abort(), []);

  const prefillFromResume = useCallback(
    async (file: File) => {
      parseAbort.current?.abort();
      const controller = new AbortController();
      parseAbort.current = controller;
      setParseState('reading');

      try {
        const body = new FormData();
        body.set('resume', file);
        const parsed = await apiPost<ParsedResume>('careers/parse-resume', body, { signal: controller.signal });

        const candidates: Array<[Path<ApplicationValues>, string | undefined]> = [
          ['fullName', parsed.full_name],
          ['email', parsed.email],
          ['phone', parsed.phone],
        ];

        let filled = 0;
        for (const [field, value] of candidates) {
          // Never clobber something the candidate typed themselves.
          if (!value || dirtyFields[field] || getValues(field)) continue;
          setValue(field, value, { shouldDirty: true, shouldValidate: true });
          filled += 1;
        }

        setFilledCount(filled);
        setParseState(filled > 0 ? 'filled' : 'nothing');
      } catch (error) {
        if (controller.signal.aborted) return;
        setParseState('failed');
        if (!(error instanceof ClientApiError)) console.error(error);
      }
    },
    [dirtyFields, getValues, setValue],
  );

  function acceptFile(file: File | null | undefined) {
    if (!file) return;
    const problem = validateResumeFile(file);
    if (problem) {
      setResumeError(problem);
      return;
    }
    setResumeError(null);
    setResume(file);
    void prefillFromResume(file);
  }

  function clearResume() {
    parseAbort.current?.abort();
    setResume(null);
    setResumeError(null);
    setParseState('idle');
  }

  function onDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    setDragging(false);
    acceptFile(event.dataTransfer.files?.[0]);
  }

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
      setResumeError(null);
      setParseState('idle');
    } catch (error) {
      if (!(error instanceof ClientApiError)) throw error;

      // Surface server-side validation next to the offending inputs.
      const serverErrors = (error.body as { errors?: Record<string, string[]> } | undefined)?.errors;
      if (error.isValidationError && serverErrors) {
        for (const [key, messages] of Object.entries(serverErrors)) {
          const field = SERVER_FIELD_MAP[key];
          if (field) setError(field, { type: 'server', message: messages[0] });
          if (key === 'resume') setResumeError(messages[0]);
        }
      }
      setStatus('error');
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
      <div
        ref={successRef}
        tabIndex={-1}
        role="status"
        className="rounded-xl border border-success/30 bg-success-surface p-6 text-body-md text-success-strong outline-none"
      >
        <p className="font-semibold">Application received.</p>
        <p className="mt-1">
          Our talent team typically responds within 5 business days. We&apos;ll review your background against{' '}
          {jobTitle} and reach out if it&apos;s a fit. A confirmation email is on its way.
        </p>
      </div>
    );
  }

  const parseMessage: Record<ParseState, string> = {
    idle: '',
    reading: 'Reading your resume…',
    filled: `We filled in ${filledCount} ${filledCount === 1 ? 'field' : 'fields'} from your resume. Please check ${filledCount === 1 ? 'it' : 'them'} before submitting.`,
    nothing: 'We could not find contact details in that file, so please fill the fields in yourself.',
    failed: 'We could not read that file automatically. You can still attach it and fill the fields in yourself.',
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      aria-labelledby="apply-heading"
      className="flex flex-col gap-4 rounded-2xl border border-hairline bg-canvas p-6"
    >
      <h2 id="apply-heading" className="text-h4 text-ink">
        Apply for {jobTitle}
      </h2>

      <div aria-live="assertive">
        {status === 'error' && (
          <div role="alert" className="rounded-lg border border-danger/30 bg-danger-surface p-3 text-body-sm text-danger-strong">
            Something went wrong submitting your application. Please check the form and try again.
          </div>
        )}
      </div>

      {/* Resume first: uploading it pre-fills the fields below. */}
      <div>
        <label
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          className={cn(
            'flex cursor-pointer flex-col items-center gap-1 rounded-xl border border-dashed px-4 py-6 text-center text-body-sm text-ink-muted transition-colors',
            'focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-focus-ring',
            dragging ? 'border-brand-navy bg-canvas-sunken' : 'border-hairline-strong hover:border-brand-navy',
            resumeError && 'border-danger',
          )}
        >
          {resume ? (
            <span className="flex items-center gap-2 font-medium text-ink">
              <FileText size={18} aria-hidden />
              {resume.name}
            </span>
          ) : (
            <>
              <Paperclip size={20} aria-hidden />
              <span className="font-medium text-ink">Drag your resume here, or click to browse</span>
              <span>PDF, DOC or DOCX · 5MB max · we&apos;ll use it to fill in your details</span>
            </>
          )}
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            className="sr-only"
            aria-describedby="resume-status"
            onChange={(event) => {
              acceptFile(event.target.files?.[0]);
              // Allow re-selecting the same file after removing it.
              event.target.value = '';
            }}
          />
        </label>

        {resume && (
          <button
            type="button"
            onClick={clearResume}
            className="mt-2 inline-flex items-center gap-1 text-body-sm font-medium text-ink-muted underline underline-offset-4 hover:text-ink"
          >
            <X size={14} aria-hidden />
            Remove resume
          </button>
        )}

        <div id="resume-status" aria-live="polite" className="mt-2 text-caption">
          {resumeError ? (
            <p role="alert" className="font-medium text-danger-strong">
              {resumeError}
            </p>
          ) : (
            parseState !== 'idle' && <p className="text-ink-muted">{parseMessage[parseState]}</p>
          )}
        </div>
      </div>

      <FloatingInput
        {...register('fullName')}
        label="Full name"
        autoComplete="name"
        required
        error={errors.fullName?.message}
      />
      <FloatingInput
        {...register('email')}
        label="Email"
        type="email"
        autoComplete="email"
        required
        error={errors.email?.message}
      />
      <FloatingInput
        {...register('phone')}
        label="Phone (optional)"
        type="tel"
        autoComplete="tel"
        error={errors.phone?.message}
      />
      <FloatingTextarea
        {...register('coverNote')}
        label="Anything you'd like us to know? (optional)"
        rows={4}
        error={errors.coverNote?.message}
      />

      {/* Honeypot */}
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label htmlFor="apply-company-website">Leave this field empty</label>
        <input {...register('companyWebsite')} id="apply-company-website" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {/* Blueprint §28.1: stays disabled until the form is valid. */}
        <Button type="submit" disabled={!isValid || isSubmitting} loading={isSubmitting} aria-describedby="apply-submit-hint">
          Submit Application
        </Button>
        <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
          Cancel
        </Button>
        <p id="apply-submit-hint" aria-live="polite" className="text-caption text-ink-muted">
          {isValid ? 'Ready to submit.' : 'Enter your name and a valid email to enable submitting.'}
        </p>
      </div>
    </form>
  );
}
