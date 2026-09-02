import Link from 'next/link';
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';
import type { ComponentProps, ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

const button = cva(
  [
    'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-button',
    'transition-[background-color,color,box-shadow,transform] duration-200 ease-standard',
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring',
    'disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]',
  ],
  {
    variants: {
      variant: {
        primary: 'bg-brand-navy text-ink-inverse hover:bg-brand-navy-deep',
        secondary: 'bg-brand-gold-muted text-brand-navy-deep hover:bg-brand-gold',
        tertiary:
          'border border-hairline-strong bg-transparent text-ink hover:bg-canvas-sunken',
        ghost: 'bg-transparent text-ink hover:bg-canvas-sunken',
        danger: 'bg-danger text-ink-inverse hover:bg-danger-strong',
      },
      size: {
        sm: 'h-9 px-4 text-body-sm',
        md: 'h-11 px-6',
        lg: 'h-13 px-8 text-body-md',
      },
      block: { true: 'w-full', false: '' },
    },
    defaultVariants: { variant: 'primary', size: 'md', block: false },
  },
);

type ButtonVariants = VariantProps<typeof button>;

type CommonProps = ButtonVariants & {
  loading?: boolean;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  children: ReactNode;
  className?: string;
};

type ButtonAsButton = CommonProps &
  Omit<ComponentProps<'button'>, keyof CommonProps> & { href?: undefined };

type ButtonAsLink = CommonProps &
  Omit<ComponentProps<typeof Link>, keyof CommonProps> & { href: string };

export type ButtonProps = ButtonAsButton | ButtonAsLink;

export function Button(props: ButtonProps) {
  const {
    variant,
    size,
    block,
    loading = false,
    iconLeft,
    iconRight,
    className,
    children,
    ...rest
  } = props;

  const classes = cn(button({ variant, size, block }), className);
  const content = (
    <>
      {loading ? <Loader2 className="size-4 animate-spin" aria-hidden /> : iconLeft}
      {children}
      {!loading && iconRight}
    </>
  );

  if ('href' in props && props.href !== undefined) {
    const { href, ...linkRest } = rest as ButtonAsLink;
    return (
      <Link href={href} className={classes} aria-busy={loading} {...linkRest}>
        {content}
      </Link>
    );
  }

  const { disabled, ...buttonRest } = rest as ButtonAsButton;
  return (
    <button
      className={classes}
      disabled={disabled || loading}
      aria-busy={loading}
      {...buttonRest}
    >
      {content}
    </button>
  );
}
