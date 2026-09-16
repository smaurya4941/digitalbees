import { Section } from '@/components/ui/Section';
import { Card } from '@/components/ui/Card';
import { SectionHeading } from '@/components/sections/SectionHeading';
import ScrollReveal from '@/components/ui/ScrollReveal';

/**
 * "The Case for Capability on Demand" — TeamBees Staff Augmentation profile
 * §6: three gaps that stall delivery when hiring alone can't keep pace.
 * Replaces a legacy hardcoded/off-brand version of this section.
 */
const gaps = [
  {
    title: 'The Time Gap',
    description: 'Critical roles remain open while delivery timelines continue to move.',
  },
  {
    title: 'The Capability Gap',
    description: 'AI, cloud, platforms and engineering skills may not exist in-house when needed.',
  },
  {
    title: 'The Flexibility Gap',
    description: 'Permanent headcount alone cannot match variable or programme-based demand.',
  },
];

export default function MarketGap() {
  return (
    <Section space="lg" tone="sunken">
      <ScrollReveal>
        <SectionHeading
          align="center"
          eyebrow="The case for capability on demand"
          title="Your roadmap is ready. Your bench may not be."
          description="Three gaps can stall delivery when hiring alone cannot keep pace."
        />
      </ScrollReveal>

      <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
        {gaps.map((gap, index) => (
          <ScrollReveal key={gap.title} delay={0.1 * index}>
            <Card padded className="h-full">
              <span className="text-eyebrow uppercase text-ink-subtle">{`0${index + 1}`}</span>
              <h3 className="mt-3 text-h4 text-ink">{gap.title}</h3>
              <p className="mt-2 text-body-sm text-ink-muted">{gap.description}</p>
            </Card>
          </ScrollReveal>
        ))}
      </div>

      <ScrollReveal delay={0.4}>
        <div className="mt-10 rounded-lg bg-brand-navy px-6 py-5 text-center">
          <p className="text-body-md font-semibold text-ink-inverse">
            TeamBees closes the gaps with validated specialists and flexible engagement models.
          </p>
        </div>
      </ScrollReveal>
    </Section>
  );
}
