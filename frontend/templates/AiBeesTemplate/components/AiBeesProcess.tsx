import React from 'react';
import type { PracticeDetail } from '@/types/practice';

interface Props {
  practice: PracticeDetail;
}

export function AiBeesProcess({ practice }: Props) {
  if (!practice.how_we_work || practice.how_we_work.length === 0) return null;

  return (
    <section className="w-full bg-surface-canvas py-space-3xl relative overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-gutter relative z-10">
        <div className="text-center mb-space-2xl">
          <span className="font-label-eyebrow text-label-eyebrow uppercase tracking-widest text-secondary font-bold">
            Workflow Architecture
          </span>
          <h2 className="font-headline-lg text-headline-lg text-text-primary mt-space-xs">
            Our Process
          </h2>
        </div>

        <div className="relative">
          {/* Horizontal Connection Line */}
          <div className="hidden lg:block absolute top-6 left-[10%] right-[10%] h-0.5 bg-border-subtle z-0"></div>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-space-lg relative z-10">
            {practice.how_we_work.map((step, idx) => (
              <div key={step.title} className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-surface-card border-4 border-surface-canvas shadow-md flex items-center justify-center font-code-mono text-code-mono font-bold text-secondary mb-space-md z-10">
                  {idx + 1}
                </div>
                <h3 className="font-headline-sm text-headline-sm text-text-primary mb-space-xs">
                  {step.title}
                </h3>
                <p className="font-body-sm text-body-sm text-text-secondary max-w-xs">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
