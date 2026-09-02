import { ArrowUpRight } from 'lucide-react';
import { Card, CardBody, CardDescription, CardTitle } from '@/components/ui/Card';
import type { PracticeSummary } from '@/types/practice';

type PracticeCardProps = {
  practice: PracticeSummary;
  index?: number;
};

export function PracticeCard({ practice, index }: PracticeCardProps) {
  return (
    <Card href={practice.href} ariaLabel={practice.name} interactive>
      <CardBody>
        <div className="flex items-start justify-between gap-4">
          {index !== undefined ? (
            <span className="text-label-sm text-ink-subtle">
              {String(index + 1).padStart(2, '0')}
            </span>
          ) : (
            <span />
          )}
          <ArrowUpRight
            size={18}
            strokeWidth={1.5}
            className="text-ink-subtle transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            aria-hidden
          />
        </div>
        <CardTitle className="mt-3">{practice.name}</CardTitle>
        {practice.tagline && (
          <p className="text-body-sm font-medium text-brand-navy">{practice.tagline}</p>
        )}
        {practice.summary && <CardDescription>{practice.summary}</CardDescription>}
      </CardBody>
    </Card>
  );
}
