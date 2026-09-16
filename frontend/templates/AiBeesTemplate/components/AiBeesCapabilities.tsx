import React from 'react';
import type { PracticeDetail } from '@/types/practice';

interface Props {
  practice: PracticeDetail;
}

export function AiBeesCapabilities({ practice }: Props) {
  if (!practice.key_capabilities || practice.key_capabilities.length === 0) return null;

  return (
    <section className="w-full bg-surface-container-low py-space-3xl">
      <div className="max-w-[1280px] mx-auto px-gutter">
        <div className="mb-space-xl max-w-xl">
          <span className="font-label-eyebrow text-label-eyebrow uppercase tracking-widest text-secondary font-bold">
            Key Capabilities
          </span>
          <h2 className="font-headline-lg text-headline-lg text-text-primary mt-space-xs">
            What {practice.name} builds
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-md">
          {practice.key_capabilities.map((capability, idx) => (
            <div key={capability.title} className="bg-surface-card p-space-lg rounded-xl shadow-sm flex flex-col justify-between">
              <div>
                <div className="font-code-mono text-code-mono text-secondary font-bold mb-space-md flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-surface-container font-mono text-[13px]">
                    0{idx + 1}
                  </span>
                  <span className="h-px bg-border-subtle flex-1"></span>
                </div>
                <h3 className="font-headline-sm text-headline-sm text-text-primary mb-space-xs">
                  {capability.title}
                </h3>
                <p className="font-body-md text-body-md text-text-secondary">
                  {capability.description}
                </p>
              </div>
              <div className="mt-space-lg pt-space-sm font-label-eyebrow text-label-eyebrow text-text-tertiary uppercase">
                Core Capability
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
