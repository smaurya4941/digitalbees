'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import type { JobPostingSummary } from '@/types/career';
import { routes } from '@/config/routes';
import { FEATURED_ROLES_TEMPLATE, type TemplateRole } from '@/lib/data/template-careers';

interface CareersOpenRolesProps {
  liveRoles?: JobPostingSummary[];
}

export default function CareersOpenRoles({ liveRoles = [] }: CareersOpenRolesProps) {
  const [selectedPractice, setSelectedPractice] = useState<string>('all');

  // Convert live roles or fallback to template roles
  const roles: TemplateRole[] = useMemo(() => {
    if (liveRoles.length > 0) {
      return liveRoles.map((r) => ({
        id: r.slug,
        slug: r.slug,
        title: r.title,
        practice: 'Engineering',
        practice_slug: 'engineering',
        location: r.location?.city ? `${r.location.city}, ${r.location.country || ''}` : 'Remote / Hybrid',
        employment_type: r.employment_type || 'Full-time',
        tags: ['Client Delivery Pod', 'Enterprise Scale'],
        description: 'Join a high-throughput engineering pod delivering modern solutions for enterprise clients.',
      }));
    }
    return FEATURED_ROLES_TEMPLATE;
  }, [liveRoles]);

  const practices = [
    { key: 'all', label: 'All Practices' },
    { key: 'ai-bees', label: 'AI Bees' },
    { key: 'servicenow-bees', label: 'ServiceNow Bees' },
    { key: 'energy-bees', label: 'Energy Bees' },
    { key: 'quality-bees', label: 'Quality Bees' },
  ];

  const filteredRoles = useMemo(() => {
    if (selectedPractice === 'all') return roles;
    return roles.filter((r) => r.practice_slug === selectedPractice);
  }, [roles, selectedPractice]);

  return (
    <section id="open-roles" className="py-16 md:py-24 bg-white dark:bg-brand-navy-dark border-b border-hairline scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="font-mono text-xs text-brand-gold font-semibold tracking-wider uppercase block mb-2">
              Join Our Collective
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-ink tracking-tight">
              Featured Open Positions
            </h2>
            <p className="text-base text-ink-muted mt-2">
              Explore high-impact opportunities across our seven specialist practices and global delivery hubs.
            </p>
          </div>

          <Link
            href={routes.contact()}
            className="inline-flex items-center gap-1.5 font-mono text-xs text-brand-gold hover:text-brand-navy font-bold uppercase tracking-wider transition-colors shrink-0 group"
          >
            <span>View All Open Roles</span>
            <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>

        {/* Practice Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-6 mb-4">
          {practices.map((p) => {
            const isActive = selectedPractice === p.key;
            return (
              <button
                key={p.key}
                type="button"
                onClick={() => setSelectedPractice(p.key)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-tight transition-all duration-200 shrink-0 whitespace-nowrap ${
                  isActive
                    ? 'bg-brand-navy text-white shadow-sm ring-2 ring-brand-gold/40'
                    : 'bg-surface-ivory dark:bg-white/5 text-ink-muted hover:text-ink border border-hairline'
                }`}
              >
                {p.label}
              </button>
            );
          })}
        </div>

        {/* Roles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredRoles.map((role) => (
            <div
              key={role.id}
              className="rounded-2xl bg-surface-ivory dark:bg-white/5 border border-hairline hover:border-brand-gold/50 transition-all p-7 flex flex-col justify-between shadow-sm hover:shadow-md group"
            >
              <div>
                <div className="flex items-center justify-between gap-3 mb-4">
                  <span className="px-2.5 py-0.5 rounded bg-brand-navy/5 dark:bg-white/10 text-brand-gold border border-brand-gold/25 font-mono text-[10px] font-semibold uppercase tracking-wider">
                    {role.practice}
                  </span>
                  <span className="text-xs font-mono text-ink-muted">
                    {role.employment_type}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-ink mb-2 tracking-tight group-hover:text-brand-navy dark:group-hover:text-brand-gold transition-colors">
                  {role.title}
                </h3>

                <p className="text-sm text-ink-muted mb-4 leading-relaxed line-clamp-2">
                  {role.description}
                </p>

                <div className="flex flex-wrap gap-1.5 mb-6">
                  {role.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded bg-white dark:bg-white/10 text-ink-muted text-[11px] font-mono border border-hairline"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-hairline flex items-center justify-between gap-4">
                <div className="flex items-center gap-1.5 text-xs text-ink-muted font-mono truncate">
                  <svg className="w-3.5 h-3.5 text-brand-gold shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="truncate">{role.location}</span>
                </div>

                <Link
                  href={routes.career(role.slug)}
                  className="inline-flex items-center gap-1 text-xs font-bold text-brand-navy dark:text-brand-gold group-hover:translate-x-0.5 transition-transform shrink-0"
                >
                  <span>Apply Now</span>
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
