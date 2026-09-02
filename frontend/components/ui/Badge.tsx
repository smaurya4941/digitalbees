import { cva, type VariantProps } from 'class-variance-authority';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

const badge = cva(
  'inline-flex items-center gap-1.5 rounded-full text-caption font-semibold',
  {
    variants: {
      tone: {
        neutral: 'bg-canvas-sunken text-ink-muted',
        brand: 'bg-brand-navy text-ink-inverse',
        gold: 'bg-brand-gold-muted/15 text-warning-strong',
        success: 'bg-success-surface text-success-strong',
        warning: 'bg-warning-surface text-warning-strong',
        danger: 'bg-danger-surface text-danger-strong',
        info: 'bg-info-surface text-info-strong',
      },
      size: {
        sm: 'px-2 py-0.5',
        md: 'px-3 py-1',
      },
    },
    defaultVariants: { tone: 'neutral', size: 'md' },
  },
);

type BadgeProps = VariantProps<typeof badge> & {
  children: ReactNode;
  className?: string;
};

export function Badge({ tone, size, className, children }: BadgeProps) {
  return <span className={cn(badge({ tone, size }), className)}>{children}</span>;
}
