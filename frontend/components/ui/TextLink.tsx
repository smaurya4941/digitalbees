import Link from 'next/link';
import { cva, type VariantProps } from 'class-variance-authority';
import { ArrowRight } from 'lucide-react';
import type { ComponentProps, ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

const link = cva(
  'inline-flex items-center gap-1 rounded-sm transition-colors duration-200 ease-standard focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring',
  {
    variants: {
      variant: {
        inline: 'text-info underline underline-offset-2 hover:text-info-strong',
        standalone: 'font-semibold text-ink hover:text-brand-navy',
        cta: 'group font-semibold text-brand-navy hover:text-brand-navy-deep',
        muted: 'text-ink-subtle hover:text-ink',
      },
    },
    defaultVariants: { variant: 'inline' },
  },
);

type TextLinkProps = VariantProps<typeof link> &
  Omit<ComponentProps<typeof Link>, 'href'> & {
    href: string;
    children: ReactNode;
    /** Append a chevron that nudges on hover (cta pattern). */
    withArrow?: boolean;
  };

export function TextLink({
  href,
  variant,
  withArrow,
  className,
  children,
  ...rest
}: TextLinkProps) {
  const external = /^https?:\/\//.test(href);

  return (
    <Link
      href={href}
      className={cn(link({ variant }), className)}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      {...rest}
    >
      {children}
      {withArrow && (
        <ArrowRight
          size={16}
          strokeWidth={1.5}
          className="transition-transform duration-200 ease-standard group-hover:translate-x-0.5"
          aria-hidden
        />
      )}
    </Link>
  );
}
