import React from 'react';
import Link from 'next/link';
import type { PracticeDetail } from '@/types/practice';
import './theme.css';

import { AiBeesHero } from './components/AiBeesHero';
import { AiBeesProofBar } from './components/AiBeesProofBar';
import { AiBeesServiceGrid } from './components/AiBeesServiceGrid';
import { AiBeesCapabilities } from './components/AiBeesCapabilities';
import { AiBeesProcess } from './components/AiBeesProcess';
import { AiBeesTechStack } from './components/AiBeesTechStack';
import { AiBeesCta } from './components/AiBeesCta';

interface AiBeesTemplateProps {
  practice: PracticeDetail;
}

export function AiBeesTemplate({ practice }: AiBeesTemplateProps) {
  return (
    <div className="theme-ai-bees bg-surface-canvas font-body-md text-text-primary antialiased selection:bg-amber-vibrant selection:text-surface-dark w-full">
      <main className="w-full">
        {/* BREADCRUMBS & TOP CONTEXT */}
        <div className="w-full bg-surface-dark text-on-primary">
          <div className="max-w-[1280px] mx-auto px-gutter py-space-sm">
            <nav aria-label="Breadcrumb" className="flex items-center gap-space-xs font-label-ui text-label-ui text-text-tertiary">
              <Link className="hover:text-amber-vibrant transition-colors" href="/">Home</Link>
              <span className="material-symbols-outlined text-[14px]">chevron_right</span>
              <Link className="hover:text-amber-vibrant transition-colors" href="/practices">Practices</Link>
              <span className="material-symbols-outlined text-[14px]">chevron_right</span>
              <span className="text-amber-vibrant font-medium">{practice.name}</span>
            </nav>
          </div>
        </div>

        <AiBeesHero practice={practice} />
        <AiBeesProofBar practice={practice} />
        <AiBeesServiceGrid practice={practice} />
        <AiBeesCapabilities practice={practice} />
        <AiBeesProcess practice={practice} />
        <AiBeesTechStack practice={practice} />
        <AiBeesCta practice={practice} />
      </main>
    </div>
  );
}
