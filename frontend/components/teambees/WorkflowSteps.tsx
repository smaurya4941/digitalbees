import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/sections/SectionHeading';
import type { ProcessStep } from '@/types/content';

type WorkflowStepsProps = {
  steps: ProcessStep[];
  eyebrow?: string;
  title?: string;
};

/**
 * A connected-step delivery-framework visual — the practice-specific,
 * more elaborate sibling of the generic {@link ProcessSteps}. A hairline
 * connector runs between the step badges on `lg:` (horizontal) and down the
 * left edge on mobile (vertical), instead of the plain unconnected grid.
 */
export function WorkflowSteps({
  steps,
  eyebrow = 'How we work',
  title = 'A delivery model built for enterprise scale',
}: WorkflowStepsProps) {
  if (steps.length === 0) return null;

  return (
    <Section space="md" tone="sunken">
      <SectionHeading eyebrow={eyebrow} title={title} />
      <ol className="relative mt-12 grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
        {steps.map((step, index) => (
          <li key={step.step} className="relative flex gap-4 lg:flex-col lg:gap-4">
            <div className="relative flex flex-col items-center">
              <span className="grid size-10 shrink-0 place-items-center rounded-full border-2 border-brand-gold bg-canvas text-sm font-semibold text-ink">
                {String(step.step).padStart(2, '0')}
              </span>
              {index < steps.length - 1 && (
                <span
                  aria-hidden
                  className="absolute top-10 left-1/2 hidden h-[calc(100%+2.5rem)] w-px -translate-x-1/2 bg-hairline-strong lg:block lg:top-5 lg:left-[calc(50%+1.25rem)] lg:h-px lg:w-[calc(100%+2rem)] lg:translate-x-0"
                />
              )}
            </div>
            <div className="flex flex-1 flex-col gap-1.5 pb-2 lg:pb-0">
              <h3 className="text-h4 text-ink">{step.title}</h3>
              <p className="text-body-sm text-ink-muted">{step.description}</p>
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
}
