'use client';

import {
  createContext,
  useContext,
  useId,
  type ReactNode,
} from 'react';
import { cn } from '@/lib/utils/cn';

type FieldContextValue = {
  id: string;
  hintId: string;
  errorId: string;
  invalid: boolean;
};

const FieldContext = createContext<FieldContextValue | null>(null);

export function useField(): FieldContextValue {
  const ctx = useContext(FieldContext);
  if (!ctx) {
    throw new Error('Input/Textarea must be rendered inside <Field>.');
  }
  return ctx;
}

/** `aria-describedby` / `aria-invalid` value for the control. */
export function fieldAria(ctx: FieldContextValue) {
  const describedBy = [ctx.invalid ? ctx.errorId : null, ctx.hintId]
    .filter(Boolean)
    .join(' ');
  return {
    id: ctx.id,
    'aria-invalid': ctx.invalid || undefined,
    'aria-describedby': describedBy || undefined,
  };
}

type FieldProps = {
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  className?: string;
  children: ReactNode;
};

export function Field({ label, hint, error, required, className, children }: FieldProps) {
  const base = useId();
  const ctx: FieldContextValue = {
    id: `${base}-control`,
    hintId: `${base}-hint`,
    errorId: `${base}-error`,
    invalid: Boolean(error),
  };

  return (
    <FieldContext.Provider value={ctx}>
      <div className={cn('flex flex-col gap-1.5', className)}>
        <label htmlFor={ctx.id} className="text-body-sm font-semibold text-ink">
          {label}
          {required && (
            <span className="ml-0.5 text-danger" aria-hidden>
              *
            </span>
          )}
        </label>
        {hint && (
          <p id={ctx.hintId} className="text-caption text-ink-subtle">
            {hint}
          </p>
        )}
        {children}
        {error && (
          <p id={ctx.errorId} role="alert" className="text-caption font-medium text-danger-strong">
            {error}
          </p>
        )}
      </div>
    </FieldContext.Provider>
  );
}
