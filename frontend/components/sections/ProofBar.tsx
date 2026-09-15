import { Section } from '@/components/ui/Section';
import type { ProofPoint } from '@/types/content';

type ProofBarProps = {
  points: ProofPoint[];
  heading?: string;
};

/** A count of zero is not proof — "0 case studies" argues against the page. */
function isProof(point: ProofPoint): boolean {
  return point.value !== 0 && point.value !== '0';
}

// Tailwind needs static class names to keep them in the production build —
// a template-string class computed from `shown.length` would get purged.
const GRID_COLS: Record<number, string> = {
  1: 'sm:grid-cols-1',
  2: 'sm:grid-cols-2',
  3: 'sm:grid-cols-3',
  4: 'sm:grid-cols-2 lg:grid-cols-4',
};

export function ProofBar({ points, heading = 'Why teams choose this practice' }: ProofBarProps) {
  const shown = points.filter(isProof);
  if (shown.length === 0) return null;

  const gridCols = GRID_COLS[Math.min(shown.length, 4)] ?? GRID_COLS[3];

  return (
    <Section space="sm" tone="sunken">
      <h2 className="sr-only">{heading}</h2>
      <dl className={`grid grid-cols-1 gap-8 ${gridCols}`}>
        {shown.map((point) => (
          <div key={point.label} className="flex flex-col gap-1">
            <dd className="text-display-md text-brand-navy">{point.value}</dd>
            <dt className="text-body-sm text-ink-muted">{point.label}</dt>
          </div>
        ))}
      </dl>
    </Section>
  );
}
