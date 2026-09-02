import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

const SIZE = {
  xs: 14,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
} as const;

type IconProps = {
  icon: LucideIcon;
  size?: keyof typeof SIZE;
  className?: string;
  /** Provide when the icon conveys meaning with no adjacent text. */
  label?: string;
};

/**
 * The one way to render an icon. Standardised on lucide-react
 * (1.5px stroke, 24px grid). Decorative by default; pass `label` when it must
 * be announced.
 */
export function Icon({ icon: LucideComponent, size = 'md', className, label }: IconProps) {
  return (
    <LucideComponent
      size={SIZE[size]}
      strokeWidth={1.5}
      className={cn('shrink-0', className)}
      aria-hidden={label ? undefined : true}
      aria-label={label}
      role={label ? 'img' : undefined}
    />
  );
}
