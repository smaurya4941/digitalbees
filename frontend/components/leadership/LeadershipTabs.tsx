'use client';

import type { LeadershipTabKey } from '@/types/leadership';

interface LeadershipTabsProps {
  activeTab: LeadershipTabKey;
  onSelectTab: (tab: LeadershipTabKey) => void;
  counts: {
    all: number;
    executive: number;
    practices: number;
    regions: number;
  };
}

export default function LeadershipTabs({
  activeTab,
  onSelectTab,
  counts,
}: LeadershipTabsProps) {
  const tabs: { key: LeadershipTabKey; label: string; count: number }[] = [
    { key: 'all', label: 'All Leadership', count: counts.all },
    { key: 'executive', label: 'Executive Leadership & Board', count: counts.executive },
    { key: 'practices', label: 'Practice Leaders (The 7 Bees)', count: counts.practices },
    { key: 'regions', label: 'Regional Delivery Heads', count: counts.regions },
  ];

  return (
    <div className="sticky top-20 z-30 bg-surface-ivory/95 dark:bg-brand-navy/95 backdrop-blur-md py-4 border-b border-hairline shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => onSelectTab(tab.key)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-xs sm:text-sm tracking-tight transition-all duration-200 shrink-0 whitespace-nowrap ${
                  isActive
                    ? 'bg-brand-navy text-white shadow-md ring-2 ring-brand-gold/50 font-semibold'
                    : 'bg-white dark:bg-white/5 text-ink-muted hover:text-ink hover:bg-white/80 border border-hairline'
                }`}
              >
                <span>{tab.label}</span>
                {tab.count > 0 && (
                  <span
                    className={`px-2 py-0.5 rounded-full font-mono text-[11px] font-bold ${
                      isActive
                        ? 'bg-brand-gold text-brand-navy'
                        : 'bg-brand-navy/10 dark:bg-white/10 text-ink-muted'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
