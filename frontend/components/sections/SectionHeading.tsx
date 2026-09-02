import type { ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string | null;
  align?: 'start' | 'center';
  as?: 'h2' | 'h3';
  action?: ReactNode;
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'start',
  as: Heading = 'h2',
  action,
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-3',
        align === 'center' && 'items-center text-center',
        action && 'md:flex-row md:items-end md:justify-between md:gap-8',
        className,
      )}
    >
      <div className={cn('flex flex-col gap-3', align === 'start' && 'max-w-2xl')}>
        {eyebrow && (
          <span className="text-eyebrow uppercase text-brand-gold-muted">{eyebrow}</span>
        )}
        <Heading className={cn(Heading === 'h2' ? 'text-h2' : 'text-h3', 'text-ink')}>
          {title}
        </Heading>
        {description && <p className="text-body-lg text-ink-muted">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
