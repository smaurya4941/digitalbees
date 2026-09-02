import { cn } from '@/lib/utils/cn';

type DividerProps = {
  orientation?: 'horizontal' | 'vertical';
  className?: string;
};

export function Divider({ orientation = 'horizontal', className }: DividerProps) {
  return (
    <hr
      role="separator"
      aria-orientation={orientation}
      className={cn(
        'border-0 bg-hairline',
        orientation === 'horizontal' ? 'h-px w-full' : 'h-full w-px',
        className,
      )}
    />
  );
}
