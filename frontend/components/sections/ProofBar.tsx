import { Section } from '@/components/ui/Section';
import type { ProofPoint } from '@/types/content';

type ProofBarProps = {
  points: ProofPoint[];
  heading?: string;
};

export function ProofBar({ points, heading = 'Why teams choose this practice' }: ProofBarProps) {
  if (points.length === 0) return null;

  return (
    <Section space="sm" tone="sunken">
      <h2 className="sr-only">{heading}</h2>
      <dl className="grid grid-cols-1 gap-8 sm:grid-cols-3">
        {points.map((point) => (
          <div key={point.label} className="flex flex-col gap-1">
            <dd className="text-display-md text-brand-navy">{point.value}</dd>
            <dt className="text-body-sm text-ink-muted">{point.label}</dt>
          </div>
        ))}
      </dl>
    </Section>
  );
}
