import { Section } from '@/components/ui/Section';
import { Card, CardBody, CardTitle, CardDescription } from '@/components/ui/Card';
import { SectionHeading } from './SectionHeading';
import type { ServiceNowFit as ServiceNowFitData } from '@/types/practice';

type ServiceNowFitProps = {
  fit: ServiceNowFitData | null | undefined;
  eyebrow?: string;
  title?: string;
};

/** ServiceNow delivery depth + "where AI fits" cards. Renders nothing when there's no ServiceNow content. */
export function ServiceNowFit({
  fit,
  eyebrow = 'AI on ServiceNow',
  title = 'Putting AI to work inside the platform you already run',
}: ServiceNowFitProps) {
  if (!fit) return null;

  return (
    <Section space="md" tone="sunken">
      <SectionHeading eyebrow={eyebrow} title={title} />
      <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1.3fr]">
        <div className="flex flex-col gap-6 rounded-lg border border-hairline bg-canvas-raised p-6">
          {fit.delivery.map((group) => (
            <div key={group.label}>
              <h3 className="text-label-sm uppercase text-ink-muted">{group.label}</h3>
              <p className="mt-1 text-body-sm text-ink">{group.items.join(' • ')}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {fit.cards.map((card) => (
            <Card key={card.title} padded>
              <CardBody className="p-0">
                <CardTitle>{card.title}</CardTitle>
                <CardDescription>{card.description}</CardDescription>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    </Section>
  );
}
