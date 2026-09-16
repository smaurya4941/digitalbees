import React from 'react';
import type { PracticeDetail } from '@/types/practice';

interface Props {
  practice: PracticeDetail;
}

export function AiBeesTechStack({ practice }: Props) {
  if (!practice.framework_stack || practice.framework_stack.length === 0) return null;

  return (
    <section className="w-full bg-surface-dark text-on-primary py-space-3xl border-t border-border-dark-subtle">
      <div className="max-w-[1280px] mx-auto px-gutter">
        <div className="mb-space-2xl">
          <span className="font-label-eyebrow text-label-eyebrow uppercase tracking-widest text-amber-vibrant font-bold">
            Ecosystem Matrix
          </span>
          <h2 className="font-headline-lg text-headline-lg text-on-primary mt-space-xs">
            Tech Stack
          </h2>
          <p className="font-body-lg text-body-lg text-text-tertiary mt-space-sm max-w-2xl">
            Curated clean ecosystem grid categorized by infrastructure tiers.
          </p>
        </div>

        <div className="flex flex-col gap-space-lg">
          {practice.framework_stack.map((layer) => (
            <div key={layer.category} className="grid grid-cols-1 md:grid-cols-12 gap-space-md border-b border-border-dark-subtle pb-space-lg">
              <div className="md:col-span-3 pt-space-xs">
                <h3 className="font-headline-sm text-headline-sm text-amber-vibrant">{layer.category}</h3>
              </div>
              <div className="md:col-span-9 flex flex-wrap gap-space-sm">
                {layer.tools.map((tool) => (
                  <div key={tool} className="px-space-md py-space-sm rounded-lg bg-surface-dark-card border border-border-dark-subtle text-on-primary font-label-ui text-label-ui flex items-center gap-space-xs hover:border-amber-glow transition-colors">
                    {tool}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
