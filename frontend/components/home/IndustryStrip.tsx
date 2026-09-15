import { getIndustries } from '@/lib/api/industries';
import { Section } from '@/components/ui/Section';
import { Card, CardBody, CardTitle } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { SectionHeading } from '@/components/sections/SectionHeading';
import { Building2 } from 'lucide-react';

export default async function IndustryStrip() {
  const industries = await getIndustries().catch(() => []);
  if (industries.length === 0) return null;

  return (
    <Section tone="canvas" space="lg" className="overflow-hidden">
      <SectionHeading title="We build for your industry" as="h2" className="mb-12" />
      <div className="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory">
        {industries.map((industry) => (
          <Card 
            key={industry.id} 
            href={industry.href} 
            interactive 
            className="min-w-[280px] sm:min-w-[320px] shrink-0 snap-start"
          >
            <CardBody className="flex flex-row items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-navy-deep/5 text-brand-navy">
                <Icon icon={Building2} size="lg" />
              </div>
              <CardTitle className="!mt-0">{industry.name}</CardTitle>
            </CardBody>
          </Card>
        ))}
      </div>
    </Section>
  );
}
