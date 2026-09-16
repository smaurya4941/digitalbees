'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from './SectionHeading';
import type { Faq } from '@/types/practice';

type FaqAccordionProps = {
  faqs: Faq[];
  eyebrow?: string;
  title?: string;
};

/**
 * A data-driven FAQ accordion for practice/sub-service pages — themed to
 * sit inside the light-canvas template sections (unlike `ServicesFAQ`,
 * which is a bespoke black-card treatment hardcoded for the generic
 * `/practices` and `/how-we-work` pages).
 */
export function FaqAccordion({ faqs, eyebrow = 'FAQ', title = 'Common questions' }: FaqAccordionProps) {
  const [openId, setOpenId] = useState<number | null>(faqs[0]?.id ?? null);

  if (faqs.length === 0) return null;

  return (
    <Section space="md" tone="sunken">
      <SectionHeading eyebrow={eyebrow} title={title} />
      <div className="mx-auto mt-10 flex max-w-3xl flex-col gap-3">
        {faqs.map((faq) => {
          const isOpen = openId === faq.id;

          return (
            <div key={faq.id} className="overflow-hidden rounded-lg border border-hairline bg-canvas-raised">
              <button
                type="button"
                onClick={() => setOpenId(isOpen ? null : faq.id)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
              >
                <span className="text-body font-semibold text-ink">{faq.question}</span>
                <ChevronDown
                  className={`size-5 shrink-0 text-ink-subtle transition-transform duration-200 ease-standard ${isOpen ? 'rotate-180' : ''}`}
                  aria-hidden
                />
              </button>
              <div
                className={`grid transition-[grid-template-rows] duration-200 ease-standard ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
              >
                <div className="overflow-hidden">
                  <p className="px-5 pb-4 text-body-sm text-ink-muted">{faq.answer}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
