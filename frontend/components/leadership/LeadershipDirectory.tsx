'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { routes } from '@/config/routes';
import type { TeamMember } from '@/types/company';
import type { FunctionalLeader, LeadershipTabKey } from '@/types/leadership';
import { STAGING_TEMPLATE_LEADERS } from '@/lib/data/template-leadership';
import LeadershipTabs from './LeadershipTabs';
import LeadershipCard from './LeadershipCard';

interface LeadershipDirectoryProps {
  liveLeaders?: TeamMember[];
}

export default function LeadershipDirectory({ liveLeaders = [] }: LeadershipDirectoryProps) {
  const [activeTab, setActiveTab] = useState<LeadershipTabKey>('all');
  const [previewStaging, setPreviewStaging] = useState<boolean>(false);

  // Convert live DB leaders into functional model if present
  const activeDataset: FunctionalLeader[] = useMemo(() => {
    if (liveLeaders.length > 0) {
      return liveLeaders.map((m) => ({
        id: m.id,
        name: m.name,
        title: m.title || 'Practice Leader',
        bio: m.bio || 'Enterprise technology leadership and delivery governance.',
        photo_url: m.photo_url,
        linkedin_url: m.linkedin_url,
        categories: ['executive', 'practice'],
        functional_tags: ['TEAMBEES LEADERSHIP'],
      }));
    }

    if (previewStaging) {
      return STAGING_TEMPLATE_LEADERS;
    }

    return [];
  }, [liveLeaders, previewStaging]);

  // Grouping by function
  const executiveLeaders = useMemo(
    () => activeDataset.filter((l) => l.categories.includes('executive')),
    [activeDataset]
  );
  const practiceLeaders = useMemo(
    () => activeDataset.filter((l) => l.categories.includes('practice')),
    [activeDataset]
  );
  const regionalLeaders = useMemo(
    () => activeDataset.filter((l) => l.categories.includes('region')),
    [activeDataset]
  );

  const counts = {
    all: activeDataset.length,
    executive: executiveLeaders.length,
    practices: practiceLeaders.length,
    regions: regionalLeaders.length,
  };

  // If no DB data and not in preview mode, render the verified Coming Soon state
  if (activeDataset.length === 0) {
    return (
      <section className="py-20 md:py-28 bg-white dark:bg-brand-navy-dark border-b border-hairline">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-brand-gold/15 text-brand-gold mx-auto flex items-center justify-center border border-brand-gold/30 mb-6">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-gold/15 text-brand-gold font-mono text-xs font-semibold uppercase tracking-wider mb-4 border border-brand-gold/30">
            Editorial Content Notice
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-ink tracking-tight mb-4">
            Leadership Profiles Being Finalized
          </h2>

          <p className="text-lg text-ink-muted leading-relaxed max-w-2xl mx-auto mb-8">
            Executive bios and domain governance rosters are currently undergoing marketing and compliance sign-off.
            In the meantime, our client engagement team can route you directly to the practice lead or regional director for your initiative.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href={routes.contact()}
              className="px-7 py-3.5 rounded-xl bg-brand-navy hover:bg-brand-navy-light text-white font-medium text-sm transition-all shadow-md"
            >
              Contact Practice Leadership Directly
            </Link>

            <button
              type="button"
              onClick={() => setPreviewStaging(true)}
              className="px-6 py-3.5 rounded-xl border border-hairline-strong bg-white dark:bg-white/10 hover:border-brand-gold text-ink font-mono text-xs font-semibold transition-all shadow-sm flex items-center gap-2"
            >
              <svg className="w-4 h-4 text-brand-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <span>Preview Governance Architecture</span>
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      {/* Staging / Preview Banner if active */}
      {previewStaging && liveLeaders.length === 0 && (
        <div className="bg-brand-gold/15 border-b border-brand-gold/30 py-3 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-ink">
              <span className="w-2 h-2 rounded-full bg-brand-gold animate-ping shrink-0" />
              <span className="font-mono font-bold uppercase tracking-wider text-brand-gold">
                STAGING PREVIEW MODE:
              </span>
              <span>
                Displaying the Google Stitch functional governance template. Live data will populate once official bios are authorized.
              </span>
            </div>
            <button
              type="button"
              onClick={() => setPreviewStaging(false)}
              className="font-mono text-xs text-ink-muted hover:text-ink underline shrink-0"
            >
              Exit Preview Mode
            </button>
          </div>
        </div>
      )}

      {/* Sticky Tab Navigation */}
      <LeadershipTabs
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        counts={counts}
      />

      <section className="py-16 md:py-24 bg-white dark:bg-brand-navy-dark border-b border-hairline min-h-[600px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
          {/* 1. Executive Leadership Group */}
          {(activeTab === 'all' || activeTab === 'executive') && executiveLeaders.length > 0 && (
            <div id="executive-leadership">
              <div className="mb-10">
                <span className="font-mono text-xs text-brand-gold font-semibold tracking-wider uppercase block mb-2">
                  Pillar 01
                </span>
                <h2 className="text-3xl font-extrabold text-ink tracking-tight">
                  Executive Leadership &amp; Board
                </h2>
                <p className="text-base text-ink-muted mt-2 max-w-2xl leading-relaxed">
                  Founding vision, enterprise architectural governance, and global client alignment.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {executiveLeaders.map((leader) => (
                  <LeadershipCard key={leader.id} leader={leader} />
                ))}
              </div>
            </div>
          )}

          {/* 2. Practice Leaders Group (The 7 Bees) */}
          {(activeTab === 'all' || activeTab === 'practices') && practiceLeaders.length > 0 && (
            <div id="practice-leaders">
              <div className="mb-10">
                <span className="font-mono text-xs text-brand-gold font-semibold tracking-wider uppercase block mb-2">
                  Pillar 02
                </span>
                <h2 className="text-3xl font-extrabold text-ink tracking-tight">
                  Practice Leaders &mdash; The 7 Bees
                </h2>
                <p className="text-base text-ink-muted mt-2 max-w-2xl leading-relaxed">
                  Domain masters with full delivery and technical accountability for their respective practice pods.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {practiceLeaders.map((leader) => (
                  <LeadershipCard key={leader.id} leader={leader} />
                ))}
              </div>
            </div>
          )}

          {/* 3. Regional Delivery Heads Group */}
          {(activeTab === 'all' || activeTab === 'regions') && regionalLeaders.length > 0 && (
            <div id="regional-leaders">
              <div className="mb-10">
                <span className="font-mono text-xs text-brand-gold font-semibold tracking-wider uppercase block mb-2">
                  Pillar 03
                </span>
                <h2 className="text-3xl font-extrabold text-ink tracking-tight">
                  Regional Delivery Heads
                </h2>
                <p className="text-base text-ink-muted mt-2 max-w-2xl leading-relaxed">
                  Local governance and operational leadership operating 24/7 follow-the-sun client delivery.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {regionalLeaders.map((leader) => (
                  <LeadershipCard key={leader.id} leader={leader} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
