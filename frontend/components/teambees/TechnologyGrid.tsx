import { Card, CardBody, CardTitle } from '@/components/ui/Card';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/sections/SectionHeading';
import type { TechnologySummary } from '@/types/content';

type TechnologyGridProps = {
  technologies: TechnologySummary[];
  eyebrow?: string;
  title: string;
  description?: string;
};

/**
 * A dense, lightweight tile grid for a practice's technology stack —
 * replaces the previous generic-`RelatedContent` reuse, whose full
 * description cards were too heavy for what's really a logo/name list.
 */
export function TechnologyGrid({ technologies, eyebrow = 'Technologies', title, description }: TechnologyGridProps) {
  if (technologies.length === 0) return null;

  return (
    <Section space="md" tone="sunken">
      <SectionHeading eyebrow={eyebrow} title={title} description={description} />
      <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {technologies.map((tech) => (
          <Card key={`${tech.slug}-${tech.id}`} href={tech.href} ariaLabel={tech.name} interactive className="text-center">
            <CardBody className="items-center justify-center gap-1 p-4 text-center">
              <CardTitle className="text-body-sm font-semibold">{tech.name}</CardTitle>
              {tech.vendor_name && <p className="text-label-sm text-ink-subtle">{tech.vendor_name}</p>}
            </CardBody>
          </Card>
        ))}
      </div>
    </Section>
  );
}
