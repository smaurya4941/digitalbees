import { Section } from '@/components/ui/Section';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { SectionHeading } from '@/components/sections/SectionHeading';
import ScrollReveal from '@/components/ui/ScrollReveal';

/**
 * "How We Engage" — TeamBees Staff Augmentation profile §15: four team
 * shapes, three ways to hire, one onboarding path. Replaces a legacy
 * component that referenced an unrelated placeholder brand name.
 */
const teamShapes = [
  {
    num: '01',
    title: 'Dedicated Specialist',
    description: 'One validated professional embedded in your team and operating rhythm.',
  },
  {
    num: '02',
    title: 'Specialist Squad',
    description: 'A multi-role team for a defined programme, directed by you.',
  },
  {
    num: '03',
    title: 'Capability Pod',
    description: 'A managed team with a named delivery lead, governance and continuity.',
  },
  {
    num: '04',
    title: 'GCC Build',
    description: 'Build and run your India capability centre, then transfer it to you.',
  },
];

const onboardingSteps = [
  { title: 'Define', description: 'Role, stack and success measures.' },
  { title: 'Match', description: 'A validated shortlist.' },
  { title: 'Embed', description: 'Access, onboarding and reporting.' },
  { title: 'Scale', description: 'Ramp, transition or rebalance.' },
];

export default function ModelBreakdown() {
  return (
    <Section space="lg">
      <ScrollReveal>
        <SectionHeading
          align="center"
          eyebrow="How we engage"
          title="Four team shapes. Three ways to hire. One onboarding path."
          description="Start with one role, scale when ready."
        />
      </ScrollReveal>

      <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {teamShapes.map((shape, index) => (
          <ScrollReveal key={shape.title} delay={0.1 * (index + 1)}>
            <Card padded interactive className="h-full">
              <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-brand-navy text-body-md font-bold text-ink-inverse">
                {shape.num}
              </span>
              <h3 className="mt-6 text-h4 text-ink">{shape.title}</h3>
              <p className="mt-2 text-body-sm text-ink-muted">{shape.description}</p>
            </Card>
          </ScrollReveal>
        ))}
      </div>

      <ScrollReveal delay={0.5}>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3 rounded-lg bg-canvas-sunken px-6 py-5 text-center">
          <span className="text-eyebrow uppercase text-ink-subtle">Hire on any shape</span>
          <Badge tone="brand">Contract</Badge>
          <Badge tone="brand">Contract-to-Hire</Badge>
          <Badge tone="brand">Permanent</Badge>
        </div>
      </ScrollReveal>

      <ScrollReveal delay={0.6}>
        <div className="mt-16">
          <SectionHeading align="center" eyebrow="One onboarding path" title="From role to running team" as="h3" />
          <ol className="mx-auto mt-10 grid max-w-4xl grid-cols-2 gap-6 md:grid-cols-4">
            {onboardingSteps.map((step, index) => (
              <li key={step.title} className="flex flex-col items-center gap-2 text-center">
                <span className="text-eyebrow uppercase text-ink-subtle">{String(index + 1).padStart(2, '0')}</span>
                <span className="text-h4 text-ink">{step.title}</span>
                <span className="text-body-sm text-ink-muted">{step.description}</span>
              </li>
            ))}
          </ol>
        </div>
      </ScrollReveal>
    </Section>
  );
}
