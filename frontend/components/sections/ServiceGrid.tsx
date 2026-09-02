import { ArrowRight } from 'lucide-react';
import { Section } from '@/components/ui/Section';
import { Card, CardBody, CardDescription, CardTitle } from '@/components/ui/Card';
import { SectionHeading } from './SectionHeading';
import type { SubService } from '@/types/practice';

type ServiceGridProps = {
  services: SubService[];
  eyebrow?: string;
  title?: string;
  description?: string;
};

export function ServiceGrid({
  services,
  eyebrow = 'What we do',
  title = 'Service lines',
  description,
}: ServiceGridProps) {
  if (services.length === 0) return null;

  return (
    <Section space="md" tone="sunken">
      <SectionHeading eyebrow={eyebrow} title={title} description={description} />
      <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <Card
            key={service.id}
            href={service.href ?? undefined}
            interactive={Boolean(service.href)}
          >
            <CardBody>
              <CardTitle>{service.name}</CardTitle>
              {service.summary && <CardDescription>{service.summary}</CardDescription>}
              {service.href && (
                <span className="mt-2 inline-flex items-center gap-1 text-body-sm font-semibold text-brand-navy">
                  Learn more
                  <ArrowRight size={14} strokeWidth={1.5} aria-hidden />
                </span>
              )}
            </CardBody>
          </Card>
        ))}
      </div>
    </Section>
  );
}
