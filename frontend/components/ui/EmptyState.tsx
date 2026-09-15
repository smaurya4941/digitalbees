import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils/cn';

type EmptyStateProps = {
  title: string;
  description?: string;
  action?: { label: string; href: string };
  className?: string;
};

/**
 * Empty-state panel (blueprint §17.6). Per §4.2 "never a dead end", an empty
 * collection still offers a next step rather than a blank page.
 */
export function EmptyState({ title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center rounded-lg border border-dashed border-hairline-strong bg-canvas-sunken px-6 py-16 text-center',
        className,
      )}
    >
      <h3 className="text-h3 text-ink">{title}</h3>
      {description && (
        <p className="mt-3 max-w-prose text-body-md text-ink-muted">{description}</p>
      )}
      {action && (
        <Button href={action.href} variant="secondary" className="mt-8">
          {action.label}
        </Button>
      )}
    </div>
  );
}
