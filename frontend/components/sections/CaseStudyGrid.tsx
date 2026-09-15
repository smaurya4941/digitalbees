import { Section } from '@/components/ui/Section';
import { CaseStudyCard } from '@/components/cards/CaseStudyCard';
import { SectionHeading } from './SectionHeading';
import type { CaseStudySummary } from '@/types/case-study';

type CaseStudyGridProps = {
  caseStudies: CaseStudySummary[];
  eyebrow?: string;
  title: string;
  description?: string;
  tone?: 'canvas' | 'sunken';
  columns?: 2 | 3;
};

const COLS = {
  2: 'md:grid-cols-2',
  3: 'md:grid-cols-2 lg:grid-cols-3',
} as const;

/** Proof block. Renders nothing when there is no proof to show. */
export function CaseStudyGrid({
  caseStudies,
  eyebrow,
  title,
  description,
  tone = 'canvas',
  columns = 3,
}: CaseStudyGridProps) {
  if (caseStudies.length === 0) return null;

  return (
    <Section space="md" tone={tone}>
      <SectionHeading eyebrow={eyebrow} title={title} description={description} />
      <div className={`mt-12 grid grid-cols-1 gap-6 ${COLS[columns]}`}>
        {caseStudies.map((caseStudy) => (
          <CaseStudyCard key={caseStudy.slug} caseStudy={caseStudy} />
        ))}
      </div>
    </Section>
  );
}
