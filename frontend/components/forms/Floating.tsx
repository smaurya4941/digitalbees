'use client';

import { useId, type ComponentProps, type ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

/**
 * Floating-label form controls (blueprint §16.2 / §28.1): the label sits
 * inside the control and floats up on focus or when the control has a value.
 *
 * - The label is a real `<label for>` (never placeholder-only, §19.2).
 * - Errors render in a `role="alert"` region tied to the control through
 *   `aria-describedby`, so they are announced when they appear (§19.2).
 * - Text inputs/textareas use `placeholder=" "` + `:placeholder-shown` to know
 *   whether they are empty; selects always show a value, so their label is
 *   permanently floated.
 * - Focus uses the global 2px gold-deep outline; nothing here removes it.
 */

const wrapper = 'relative';

const control = cn(
  'peer w-full rounded-xl border bg-canvas-raised px-4 pb-2 pt-6 text-body-md text-ink',
  'border-hairline-strong placeholder-transparent',
  'transition-[border-color] duration-150 ease-standard',
  'focus-visible:border-focus-ring',
  'disabled:cursor-not-allowed disabled:bg-canvas-sunken disabled:opacity-70',
  'aria-[invalid=true]:border-danger',
);

const label = cn(
  'pointer-events-none absolute left-4 top-4 origin-left text-body-md text-ink-muted',
  'transition-[transform] duration-150 ease-standard',
  // Floated state: focused, or filled (placeholder no longer shown).
  'peer-focus:-translate-y-2.5 peer-focus:scale-75',
  'peer-[:not(:placeholder-shown)]:-translate-y-2.5 peer-[:not(:placeholder-shown)]:scale-75',
);

const labelFloated = cn(
  'pointer-events-none absolute left-4 top-4 origin-left -translate-y-2.5 scale-75 text-body-md text-ink-muted',
);

type CommonProps = {
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  wrapperClassName?: string;
};

function Message({ id, error, hint }: { id: string; error?: string; hint?: string }): ReactNode {
  if (error) {
    return (
      <p id={id} role="alert" className="mt-1.5 text-caption font-medium text-danger-strong">
        {error}
      </p>
    );
  }
  if (hint) {
    return (
      <p id={id} className="mt-1.5 text-caption text-ink-subtle">
        {hint}
      </p>
    );
  }
  return null;
}

function describedBy(id: string, error?: string, hint?: string) {
  return error || hint ? `${id}-msg` : undefined;
}

function RequiredMark({ required }: { required?: boolean }) {
  return required ? (
    <span className="ml-0.5 text-danger" aria-hidden>
      *
    </span>
  ) : null;
}

type FloatingInputProps = CommonProps & Omit<ComponentProps<'input'>, 'id' | 'placeholder'>;

export function FloatingInput({
  label: text,
  error,
  hint,
  required,
  wrapperClassName,
  className,
  ...props
}: FloatingInputProps) {
  const id = useId();
  return (
    <div className={wrapperClassName}>
      <div className={wrapper}>
        <input
          {...props}
          id={id}
          placeholder=" "
          required={required}
          aria-required={required || undefined}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(id, error, hint)}
          className={cn(control, 'h-14', className)}
        />
        <label htmlFor={id} className={label}>
          {text}
          <RequiredMark required={required} />
        </label>
      </div>
      <Message id={`${id}-msg`} error={error} hint={hint} />
    </div>
  );
}

type FloatingTextareaProps = CommonProps & Omit<ComponentProps<'textarea'>, 'id' | 'placeholder'>;

export function FloatingTextarea({
  label: text,
  error,
  hint,
  required,
  wrapperClassName,
  className,
  rows = 4,
  ...props
}: FloatingTextareaProps) {
  const id = useId();
  return (
    <div className={wrapperClassName}>
      <div className={wrapper}>
        <textarea
          {...props}
          id={id}
          rows={rows}
          placeholder=" "
          required={required}
          aria-required={required || undefined}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(id, error, hint)}
          className={cn(control, 'min-h-28 resize-y', className)}
        />
        <label htmlFor={id} className={label}>
          {text}
          <RequiredMark required={required} />
        </label>
      </div>
      <Message id={`${id}-msg`} error={error} hint={hint} />
    </div>
  );
}

type FloatingSelectProps = CommonProps & Omit<ComponentProps<'select'>, 'id'>;

export function FloatingSelect({
  label: text,
  error,
  hint,
  required,
  wrapperClassName,
  className,
  children,
  ...props
}: FloatingSelectProps) {
  const id = useId();
  return (
    <div className={wrapperClassName}>
      <div className={wrapper}>
        <select
          {...props}
          id={id}
          required={required}
          aria-required={required || undefined}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(id, error, hint)}
          className={cn(control, 'h-14 appearance-none pr-10', className)}
        >
          {children}
        </select>
        <label htmlFor={id} className={labelFloated}>
          {text}
          <RequiredMark required={required} />
        </label>
        <span
          aria-hidden
          className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-ink-muted"
        >
          ▾
        </span>
      </div>
      <Message id={`${id}-msg`} error={error} hint={hint} />
    </div>
  );
}
