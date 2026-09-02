import { Section } from '@/components/ui/Section';
import { ContentCard } from '@/components/cards/ContentCard';
import { SectionHeading } from './SectionHeading';
import type { EntitySummary } from '@/types/content';

type RelatedContentProps = {
  items: EntitySummary[];
  eyebrow?: string;
  title: string;
  description?: string;
  itemEyebrow?: string;
  tone?: 'canvas' | 'sunken';
  columns?: 2 | 3 | 4;
};

const COLS = {
  2: 'md:grid-cols-2',
  3: 'md:grid-cols-2 lg:grid-cols-3',
  4: 'md:grid-cols-2 lg:grid-cols-4',
} as const;

export function RelatedContent({
  items,
  eyebrow,
  title,
  description,
  itemEyebrow,
  tone = 'canvas',
  columns = 3,
}: RelatedContentProps) {
  if (items.length === 0) return null;

  return (
    <Section space="md" tone={tone}>
      <SectionHeading eyebrow={eyebrow} title={title} description={description} />
      <div className={`mt-12 grid grid-cols-1 gap-6 ${COLS[columns]}`}>
        {items.map((item) => (
          <ContentCard key={`${item.slug}-${item.id}`} item={item} eyebrow={itemEyebrow} />
        ))}
      </div>
    </Section>
  );
}
