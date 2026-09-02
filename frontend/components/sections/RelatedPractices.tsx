import { Section } from '@/components/ui/Section';
import { PracticeCard } from '@/components/cards/PracticeCard';
import { SectionHeading } from './SectionHeading';
import type { PracticeSummary } from '@/types/practice';

type RelatedPracticesProps = {
  practices: PracticeSummary[];
  title?: string;
};

export function RelatedPractices({
  practices,
  title = 'Explore other practices',
}: RelatedPracticesProps) {
  if (practices.length === 0) return null;

  return (
    <Section space="md" tone="sunken">
      <SectionHeading eyebrow="More from TeamBees" title={title} />
      <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {practices.map((practice) => (
          <PracticeCard key={practice.id} practice={practice} />
        ))}
      </div>
    </Section>
  );
}
