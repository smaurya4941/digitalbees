import Link from 'next/link';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/sections/SectionHeading';
import type { IndustrySummary } from '@/types/content';

type IndustryChipsProps = {
  industries: IndustrySummary[];
  eyebrow?: string;
  title: string;
};

/**
 * A compact wrapping pill row for "Where we deliver" — replaces the
 * previous generic-`RelatedContent` full-card grid, which was overkill for
 * what's really a short list of industry labels.
 */
export function IndustryChips({ industries, eyebrow = 'Industries', title }: IndustryChipsProps) {
  if (industries.length === 0) return null;

  return (
    <Section space="md">
      <SectionHeading eyebrow={eyebrow} title={title} />
      <div className="mt-8 flex flex-wrap gap-3">
        {industries.map((industry) => (
          <Link
            key={`${industry.slug}-${industry.id}`}
            href={industry.href}
            className="inline-flex items-center rounded-full border border-hairline bg-canvas-raised px-5 py-2.5 text-sm font-medium text-ink transition-colors duration-200 ease-standard hover:border-brand-gold hover:bg-brand-gold-muted"
          >
            {industry.name}
          </Link>
        ))}
      </div>
    </Section>
  );
}
