import { Section } from '@/components/ui/Section';
import { SectionHeading } from './SectionHeading';
import type { ProcessStep } from '@/types/content';

type ProcessStepsProps = {
  steps: ProcessStep[];
  eyebrow?: string;
  title?: string;
};

export function ProcessSteps({
  steps,
  eyebrow = 'How we work',
  title = 'A delivery model built for enterprise scale',
}: ProcessStepsProps) {
  if (steps.length === 0) return null;

  return (
    <Section space="md">
      <SectionHeading eyebrow={eyebrow} title={title} />
      <ol className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
        {steps.map((step) => (
          <li key={step.step} className="flex flex-col gap-3 border-t-2 border-brand-gold-muted pt-4">
            <span className="text-label-sm text-ink-subtle">
              {String(step.step).padStart(2, '0')}
            </span>
            <h3 className="text-h4 text-ink">{step.title}</h3>
            <p className="text-body-sm text-ink-muted">{step.description}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}
