import { cva, type VariantProps } from 'class-variance-authority';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';
import { Container } from './Container';

const section = cva('', {
  variants: {
    space: {
      sm: 'py-section-sm',
      md: 'py-section-md',
      lg: 'py-section-lg',
    },
    tone: {
      canvas: 'bg-canvas text-ink',
      sunken: 'bg-canvas-sunken text-ink',
      navy: 'bg-brand-navy-deep text-ink-inverse',
    },
  },
  defaultVariants: { space: 'md', tone: 'canvas' },
});

type SectionProps = VariantProps<typeof section> & {
  id?: string;
  className?: string;
  containerWidth?: 'narrow' | 'standard' | 'wide' | 'max';
  children: ReactNode;
};

/** Standard page section: consistent vertical rhythm + gutter container. */
export function Section({
  id,
  space,
  tone,
  containerWidth = 'max',
  className,
  children,
}: SectionProps) {
  return (
    <section id={id} className={cn(section({ space, tone }), className)}>
      <Container width={containerWidth}>{children}</Container>
    </section>
  );
}
