import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/sections/SectionHeading';
import type { KeyCapability } from '@/types/practice';

type CapabilityGridProps = {
  capabilities: KeyCapability[];
  eyebrow?: string;
  title: string;
  description?: string;
};

/**
 * A capability-card grid, purpose-built for a practice's "Key Capabilities"
 * section — replaces the previous generic-`RelatedContent` reuse, which
 * force-fit `{title,description}` rows into an unrelated entity-card shape.
 */
export function CapabilityGrid({ capabilities, eyebrow = 'Key capabilities', title, description }: CapabilityGridProps) {
  if (capabilities.length === 0) return null;

  return (
    <Section space="md">
      <SectionHeading eyebrow={eyebrow} title={title} description={description} />
      <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {capabilities.map((capability, index) => (
          <div
            key={capability.title}
            className="flex flex-col gap-4 rounded-lg border border-hairline bg-canvas-raised p-6 transition-[transform,box-shadow] duration-200 ease-standard hover:-translate-y-1 hover:shadow-md"
          >
            <span className="grid size-9 place-items-center rounded-full bg-brand-navy text-sm font-semibold text-white">
              {String(index + 1).padStart(2, '0')}
            </span>
            <h3 className="text-h4 text-ink">{capability.title}</h3>
            <p className="text-body-sm text-ink-muted">{capability.description}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
