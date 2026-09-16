import React from 'react';
import Link from 'next/link';
import type { PracticeDetail } from '@/types/practice';

interface Props {
  practice: PracticeDetail;
}

export function AiBeesServiceGrid({ practice }: Props) {
  if (!practice.services || practice.services.length === 0) return null;

  const icons = ['smart_toy', 'auto_awesome', 'neurology', 'psychology', 'build', 'integration_instructions'];

  return (
    <section className="w-full bg-surface-canvas py-space-3xl">
      <div className="max-w-[1280px] mx-auto px-gutter">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-space-2xl gap-space-md">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 mb-space-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
              <span className="font-label-eyebrow text-label-eyebrow uppercase tracking-widest text-secondary font-bold">
                What We Do
              </span>
            </div>
            <h2 className="font-headline-lg text-headline-lg text-text-primary">
              {practice.name} service lines
            </h2>
            <p className="font-body-lg text-body-lg text-text-secondary mt-space-sm">
              Explore our core competencies designed for high-performance enterprise deployments.
            </p>
          </div>
          <Link
            className="font-label-ui text-label-ui text-text-primary hover:text-secondary font-semibold inline-flex items-center gap-1 group"
            href="/contact"
          >
            <span>Inquire about custom pilots</span>
            <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">
              arrow_forward
            </span>
          </Link>
        </div>

        {/* Service Line Cards Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-lg">
          {practice.services.map((service, idx) => (
            <div
              key={service.name}
              className="p-space-xl rounded-2xl bg-surface-card shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-space-lg">
                  <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center text-text-primary group-hover:bg-amber-glow group-hover:text-secondary transition-colors">
                    <span className="material-symbols-outlined text-[26px]">
                      {icons[idx % icons.length]}
                    </span>
                  </div>
                  <span className="font-label-eyebrow text-label-eyebrow uppercase tracking-wider text-text-tertiary">
                    0{idx + 1}
                  </span>
                </div>
                <h3 className="font-headline-sm text-headline-sm text-text-primary mb-space-xs group-hover:text-secondary transition-colors">
                  {service.name}
                </h3>
                <p className="font-body-md text-body-md text-text-secondary">
                  {service.summary}
                </p>
              </div>
              <Link
                className="inline-flex items-center gap-space-xs font-label-ui text-label-ui font-semibold text-text-primary hover:text-secondary mt-space-lg"
                href={`/practices/${practice.slug}/${service.name.toLowerCase().replace(/ /g, '-')}`}
              >
                <span>Learn more</span>
                <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
