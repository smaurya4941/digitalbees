'use client';

import {
  createContext,
  forwardRef,
  useContext,
  useCallback,
  useState,
  type ButtonHTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, CheckCircle2, Info, Loader2, X } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import type { ContentStatus } from '@/lib/admin/types';

/* -------------------------------------------------------------------------- */
/*  Button                                                                   */
/* -------------------------------------------------------------------------- */

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md';

const buttonBase =
  'inline-flex items-center justify-center gap-2 rounded-xl font-medium whitespace-nowrap transition-all duration-150 ' +
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold ' +
  'disabled:pointer-events-none disabled:opacity-50 active:scale-[0.985]';

const buttonVariants: Record<ButtonVariant, string> = {
  primary: 'bg-brand-navy text-white hover:bg-brand-navy-deep shadow-sm',
  secondary:
    'bg-white text-brand-navy border border-hairline-strong hover:border-brand-navy hover:bg-neutral-50',
  ghost: 'text-ink-muted hover:bg-neutral-100 hover:text-ink',
  danger: 'bg-danger text-white hover:bg-danger-strong shadow-sm',
};

const buttonSizes: Record<ButtonSize, string> = {
  sm: 'h-9 px-3.5 text-sm',
  md: 'h-11 px-5 text-sm',
};

export interface AdminButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  iconLeft?: ReactNode;
}

export const AdminButton = forwardRef<HTMLButtonElement, AdminButtonProps>(function AdminButton(
  { variant = 'primary', size = 'md', loading, iconLeft, className, children, disabled, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(buttonBase, buttonVariants[variant], buttonSizes[size], className)}
      {...rest}
    >
      {loading ? <Loader2 className="size-4 animate-spin" aria-hidden /> : iconLeft}
      {children}
    </button>
  );
});

/* -------------------------------------------------------------------------- */
/*  Form field wrapper + inputs                                              */
/* -------------------------------------------------------------------------- */

export function Field({
  label,
  htmlFor,
  hint,
  error,
  required,
  children,
}: {
  label: string;
  htmlFor?: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-sm font-medium text-ink">
        {label}
        {required && <span className="ml-0.5 text-danger">*</span>}
      </label>
      {children}
      {error ? (
        <p className="flex items-center gap-1.5 text-xs text-danger">
          <AlertCircle className="size-3.5" aria-hidden />
          {error}
        </p>
      ) : hint ? (
        <p className="text-xs text-ink-subtle">{hint}</p>
      ) : null}
    </div>
  );
}

const controlBase =
  'w-full rounded-xl border bg-white px-3.5 text-sm text-ink placeholder:text-ink-subtle ' +
  'transition-colors focus:outline-none focus:ring-4 focus:ring-brand-navy/10 disabled:opacity-60';

export const TextInput = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean }>(
  function TextInput({ className, invalid, ...rest }, ref) {
    return (
      <input
        ref={ref}
        className={cn(
          controlBase,
          'h-11',
          invalid ? 'border-danger focus:border-danger' : 'border-hairline-strong focus:border-brand-navy',
          className,
        )}
        {...rest}
      />
    );
  },
);

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement> & { invalid?: boolean }
>(function Textarea({ className, invalid, ...rest }, ref) {
  return (
    <textarea
      ref={ref}
      className={cn(
        controlBase,
        'min-h-[104px] resize-y py-2.5 leading-relaxed',
        invalid ? 'border-danger' : 'border-hairline-strong focus:border-brand-navy',
        className,
      )}
      {...rest}
    />
  );
});

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  function Select({ className, children, ...rest }, ref) {
    return (
      <select
        ref={ref}
        className={cn(controlBase, 'h-11 border-hairline-strong focus:border-brand-navy', className)}
        {...rest}
      >
        {children}
      </select>
    );
  },
);

/* -------------------------------------------------------------------------- */
/*  Surfaces                                                                 */
/* -------------------------------------------------------------------------- */

export function Panel({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-hairline bg-white shadow-[0_1px_2px_rgba(11,31,58,0.04),0_8px_24px_-12px_rgba(11,31,58,0.10)]',
        className,
      )}
    >
      {children}
    </div>
  );
}

export function PageHeading({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-ink">{title}</h1>
        {description && <p className="mt-1 text-sm text-ink-muted">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </div>
  );
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 px-6 py-16 text-center">
      <div className="grid size-12 place-items-center rounded-full bg-neutral-100 text-ink-subtle">
        <Info className="size-5" aria-hidden />
      </div>
      <p className="text-sm font-medium text-ink">{title}</p>
      {description && <p className="max-w-sm text-sm text-ink-subtle">{description}</p>}
      {action && <div className="mt-3">{action}</div>}
    </div>
  );
}

export function Spinner({ label = 'Loading…' }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-2 py-16 text-sm text-ink-subtle">
      <Loader2 className="size-4 animate-spin" aria-hidden />
      {label}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Status pill                                                              */
/* -------------------------------------------------------------------------- */

const statusStyles: Record<ContentStatus, string> = {
  published: 'bg-success-surface text-success-strong ring-success/20',
  draft: 'bg-warning-surface text-warning-strong ring-warning/20',
  archived: 'bg-neutral-100 text-ink-muted ring-neutral-300/60',
};

export function StatusPill({ status }: { status: ContentStatus }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ring-1 ring-inset',
        statusStyles[status],
      )}
    >
      <span className="size-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/*  Toasts                                                                   */
/* -------------------------------------------------------------------------- */

type Toast = { id: number; tone: 'success' | 'error'; message: string };

const ToastContext = createContext<{
  success: (message: string) => void;
  error: (message: string) => void;
} | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const push = useCallback((tone: Toast['tone'], message: string) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, tone, message }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4500);
  }, []);

  const api = useMemoisedToastApi(push);

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex flex-col items-center gap-2 px-4">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.96 }}
              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
              className={cn(
                'pointer-events-auto flex w-full max-w-sm items-start gap-2.5 rounded-xl border px-4 py-3 text-sm shadow-lg',
                t.tone === 'success'
                  ? 'border-success/20 bg-white text-ink'
                  : 'border-danger/20 bg-white text-ink',
              )}
            >
              {t.tone === 'success' ? (
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" aria-hidden />
              ) : (
                <AlertCircle className="mt-0.5 size-4 shrink-0 text-danger" aria-hidden />
              )}
              <span className="flex-1">{t.message}</span>
              <button
                onClick={() => setToasts((list) => list.filter((x) => x.id !== t.id))}
                className="text-ink-subtle hover:text-ink"
                aria-label="Dismiss"
              >
                <X className="size-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

function useMemoisedToastApi(push: (tone: Toast['tone'], message: string) => void) {
  return {
    success: useCallback((m: string) => push('success', m), [push]),
    error: useCallback((m: string) => push('error', m), [push]),
  };
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');
  return ctx;
}
