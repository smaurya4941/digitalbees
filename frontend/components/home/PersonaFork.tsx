import { Section } from '@/components/ui/Section';
import { Card, CardBody, CardTitle, CardDescription } from '@/components/ui/Card';
import { SectionHeading } from '@/components/sections/SectionHeading';
import { Icon } from '@/components/ui/Icon';
import { Users, Blocks, Briefcase } from 'lucide-react';

export default function PersonaFork() {
  return (
    <Section tone="canvas" space="lg">
      <SectionHeading
        title="Wherever you're starting from, there's a fast path to what you need."
        as="h2"
        className="mb-12 max-w-3xl"
      />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card href="/practices/talent-bees" interactive>
          <CardBody className="gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-gold-soft/20 text-brand-gold">
              <Icon icon={Users} size="lg" />
            </div>
            <CardTitle>I need to hire</CardTitle>
            <CardDescription>
              See how Talent Bees fills critical roles in days, not months.
            </CardDescription>
          </CardBody>
        </Card>

        <Card href="/practices" interactive>
          <CardBody className="gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-navy-deep/10 text-brand-navy">
              <Icon icon={Blocks} size="lg" />
            </div>
            <CardTitle>I need to build</CardTitle>
            <CardDescription>
              See how Digital, AI, Quality, ServiceNow, and Energy Bees deliver production work, not just headcount.
            </CardDescription>
          </CardBody>
        </Card>

        <Card href="/careers" interactive>
          <CardBody className="gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100 text-ink-muted">
              <Icon icon={Briefcase} size="lg" />
            </div>
            <CardTitle>I&apos;m a candidate</CardTitle>
            <CardDescription>
              See open roles and what it&apos;s actually like to work here.
            </CardDescription>
          </CardBody>
        </Card>
      </div>
    </Section>
  );
}
