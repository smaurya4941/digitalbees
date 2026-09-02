import Link from 'next/link';
import { cva, type VariantProps } from 'class-variance-authority';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

const card = cva(
  'group relative flex flex-col overflow-hidden rounded-lg border border-hairline bg-canvas-raised transition-[transform,box-shadow] duration-200 ease-standard',
  {
    variants: {
      interactive: {
        true: 'hover:-translate-y-1 hover:shadow-md focus-within:-translate-y-1 focus-within:shadow-md',
        false: '',
      },
      padded: { true: 'p-6', false: '' },
    },
    defaultVariants: { interactive: false, padded: false },
  },
);

type CardProps = VariantProps<typeof card> & {
  className?: string;
  children: ReactNode;
  /** Makes the whole card a link (stretched-link pattern, keeps text selectable). */
  href?: string;
  ariaLabel?: string;
};

export function Card({ interactive, padded, href, ariaLabel, className, children }: CardProps) {
  return (
    <article className={cn(card({ interactive: interactive ?? Boolean(href), padded }), className)}>
      {href && (
        <Link
          href={href}
          aria-label={ariaLabel}
          className="absolute inset-0 z-10 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
        />
      )}
      {children}
    </article>
  );
}

export function CardMedia({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn('relative aspect-[16/10] overflow-hidden', className)}>{children}</div>
  );
}

export function CardBody({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('flex flex-1 flex-col gap-2 p-6', className)}>{children}</div>;
}

export function CardEyebrow({ children }: { children: ReactNode }) {
  return <span className="text-eyebrow uppercase text-ink-subtle">{children}</span>;
}

export function CardTitle({ children, className }: { children: ReactNode; className?: string }) {
  return <h3 className={cn('text-h4 text-ink', className)}>{children}</h3>;
}

export function CardDescription({ children }: { children: ReactNode }) {
  return <p className="text-body-sm text-ink-muted">{children}</p>;
}
