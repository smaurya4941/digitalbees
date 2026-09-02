import { cva, type VariantProps } from 'class-variance-authority';
import type { ElementType, ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

const container = cva('mx-auto w-full px-margin-mobile md:px-margin-desktop', {
  variants: {
    width: {
      narrow: 'max-w-container-narrow',
      standard: 'max-w-container-standard',
      wide: 'max-w-container-wide',
      max: 'max-w-container-max',
    },
  },
  defaultVariants: { width: 'max' },
});

type ContainerProps = VariantProps<typeof container> & {
  as?: ElementType;
  className?: string;
  children: ReactNode;
};

export function Container({ as: Tag = 'div', width, className, children }: ContainerProps) {
  return <Tag className={cn(container({ width }), className)}>{children}</Tag>;
}
