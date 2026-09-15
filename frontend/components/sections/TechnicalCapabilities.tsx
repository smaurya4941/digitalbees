import { Section } from '@/components/ui/Section';
import { Card, CardBody, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { SectionHeading } from './SectionHeading';
import type { TechnicalCapability } from '@/types/practice';

type TechnicalCapabilitiesProps = {
  capabilities: TechnicalCapability[];
  eyebrow?: string;
  title?: string;
};

/** Deep technical-capability cards with "proven in" case-study tags. Renders nothing when empty. */
export function TechnicalCapabilities({
  capabilities,
  eyebrow = 'Technical depth',
  title = 'Capability areas, proven in production',
}: TechnicalCapabilitiesProps) {
  if (capabilities.length === 0) return null;

  return (
    <Section space="md">
      <SectionHeading eyebrow={eyebrow} title={title} />
      <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {capabilities.map((capability) => (
          <Card key={capability.title} padded>
            <CardBody className="p-0">
              <CardTitle>{capability.title}</CardTitle>
              <ul className="mt-3 flex flex-col gap-1.5">
                {capability.points.map((point) => (
                  <li key={point} className="text-body-sm text-ink-muted">
                    {point}
                  </li>
                ))}
              </ul>
              {capability.proven_in.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {capability.proven_in.map((label) => (
                    <Badge key={label} tone="gold" size="sm">
                      Proven in {label}
                    </Badge>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>
        ))}
      </div>
    </Section>
  );
}
