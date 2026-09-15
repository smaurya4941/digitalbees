import { Check } from 'lucide-react';
import { Section } from '@/components/ui/Section';
import { Icon } from '@/components/ui/Icon';
import { SectionHeading } from './SectionHeading';
import type { WhatsIncludedItem } from '@/types/practice';

type WhatsIncludedListProps = {
  items: WhatsIncludedItem[];
  eyebrow?: string;
  title?: string;
};

/**
 * The "what's included" list for a sub-service page (blueprint §22.3/§22.4) —
 * a small structured list distinct from the practice hub's ServiceGrid or
 * ProcessSteps (neither shape fits: this has no count/step number, just a
 * title + description pair per item).
 */
export function WhatsIncludedList({ items, eyebrow = "What's included", title = 'What you get' }: WhatsIncludedListProps) {
  if (items.length === 0) return null;

  return (
    <Section space="md">
      <SectionHeading eyebrow={eyebrow} title={title} />
      <ul className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2">
        {items.map((item) => (
          <li key={item.title} className="flex gap-4">
            <Icon icon={Check} size="md" className="mt-1 text-brand-navy" />
            <div className="flex flex-col gap-1">
              <h3 className="text-h4 text-ink">{item.title}</h3>
              <p className="text-body-sm text-ink-muted">{item.description}</p>
            </div>
          </li>
        ))}
      </ul>
    </Section>
  );
}
