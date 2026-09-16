import React from 'react';
import type { PracticeDetail } from '@/types/practice';

interface Props {
  practice: PracticeDetail;
}

export function AiBeesProofBar({ practice }: Props) {
  if (!practice.proof_points || practice.proof_points.length === 0) return null;

  return (
    <section className="w-full bg-surface-dark text-on-primary pb-space-2xl -mt-1 relative z-20">
      <div className="max-w-[1280px] mx-auto px-gutter">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-space-md p-space-md rounded-2xl bg-surface-dark-card shadow-xl">
          {practice.proof_points.map((point, index) => (
            <div key={index} className="flex flex-col p-space-md rounded-xl bg-surface-dark">
              <div className="flex items-baseline gap-1">
                <span className={`font-stat-display text-stat-display ${index % 2 === 0 ? 'text-on-primary' : 'text-amber-vibrant'}`}>
                  {point.value}
                </span>
              </div>
              <span className="font-label-eyebrow text-label-eyebrow uppercase text-amber-vibrant tracking-wider mt-1">
                {point.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
