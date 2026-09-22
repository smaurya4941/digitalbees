'use client';

import Link from 'next/link';
import { UserCheck, Compass, GraduationCap, Handshake, Newspaper, ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export type PersonaKey = 'hire' | 'delivery' | 'candidate' | 'partner' | 'press';

export interface PersonaMeta {
  key: PersonaKey;
  label: string;
  badge: string;
  description: string;
  isExternalLink?: boolean;
  href?: string;
}

export const PERSONA_LIST: PersonaMeta[] = [
  {
    key: 'hire',
    label: "I'm looking to hire talent",
    badge: 'Talent Bench Request',
    description: 'Rapid deployment of pre-vetted engineers & dedicated pods within 48 hours.',
  },
  {
    key: 'delivery',
    label: 'I need a delivery partner',
    badge: 'Strategic Consultation',
    description: 'End-to-end modernization, CTRM architecture, or ServiceNow execution scoping.',
  },
  {
    key: 'candidate',
    label: "I'm a candidate",
    badge: 'Explore Open Roles',
    description: 'Join elite delivery pods across 4 global hubs — view open positions & life at TeamBees.',
    isExternalLink: true,
    href: '/careers',
  },
  {
    key: 'partner',
    label: "I'm a vendor / partner",
    badge: 'Partnerships & Alliances',
    description: 'Technology ecosystem integrations, cloud alliances, and vendor solutions channel.',
  },
  {
    key: 'press',
    label: 'Press & Media inquiry',
    badge: 'Communications Desk',
    description: 'Media relations, editorial inquiries, brand asset kits, and thought leadership commentary.',
  },
];

interface PersonaRouterProps {
  activePersona: PersonaKey;
  onSelectPersona: (key: PersonaKey) => void;
}

export default function PersonaRouter({ activePersona, onSelectPersona }: PersonaRouterProps) {
  const getIcon = (key: PersonaKey) => {
    switch (key) {
      case 'hire':
        return <UserCheck className="h-6 w-6" />;
      case 'delivery':
        return <Compass className="h-6 w-6" />;
      case 'candidate':
        return <GraduationCap className="h-6 w-6" />;
      case 'partner':
        return <Handshake className="h-6 w-6" />;
      case 'press':
        return <Newspaper className="h-6 w-6" />;
    }
  };

  return (
    <div className="w-full">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <span className="text-label-sm font-semibold uppercase tracking-wider text-brand-gold-deep">
            Step 1 · Select Your Objective
          </span>
          <h2 className="text-title-md font-bold text-[#0B1F3A]">
            How can we direct your inquiry?
          </h2>
        </div>
        <span className="hidden text-xs text-ink-muted sm:inline-block">
          Select a channel to route to the accountable team
        </span>
      </div>

      {/* 5 Persona Cards Grid */}
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-5" role="radiogroup" aria-label="Inquiry Objective">
        {PERSONA_LIST.map((item) => {
          const isActive = activePersona === item.key;

          if (item.isExternalLink && item.href) {
            return (
              <Link
                key={item.key}
                href={item.href}
                className="group relative flex flex-col justify-between rounded-2xl border border-neutral-200 bg-white p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-navy hover:shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-700 transition-colors group-hover:bg-amber-100">
                      {getIcon(item.key)}
                    </div>
                    <span className="flex items-center gap-0.5 text-xs font-semibold text-brand-navy group-hover:underline">
                      Careers <ArrowUpRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                  <div className="mt-4 text-xs font-semibold uppercase tracking-wider text-ink-muted">
                    {item.badge}
                  </div>
                  <h3 className="mt-1 text-body-md font-bold text-[#0B1F3A]">
                    {item.label}
                  </h3>
                  <p className="mt-2 text-xs text-ink-muted line-clamp-2">
                    {item.description}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-neutral-100 text-xs font-medium text-brand-gold-deep">
                  Navigate to Careers Hub →
                </div>
              </Link>
            );
          }

          return (
            <button
              key={item.key}
              type="button"
              role="radio"
              aria-checked={isActive}
              onClick={() => onSelectPersona(item.key)}
              className={cn(
                'group relative flex flex-col justify-between rounded-2xl border p-5 text-left transition-all duration-200',
                isActive
                  ? 'border-[#0B1F3A] bg-[#0B1F3A] text-white shadow-lg ring-2 ring-[#C6963A]/40'
                  : 'border-neutral-200 bg-white text-ink hover:-translate-y-0.5 hover:border-neutral-300 hover:shadow-md',
              )}
            >
              <div>
                <div className="flex items-center justify-between">
                  <div
                    className={cn(
                      'flex h-11 w-11 items-center justify-center rounded-xl transition-colors',
                      isActive
                        ? 'bg-[#C6963A] text-[#0B1F3A]'
                        : 'bg-neutral-100 text-brand-navy group-hover:bg-neutral-200/70',
                    )}
                  >
                    {getIcon(item.key)}
                  </div>
                  {isActive && (
                    <span className="flex h-2.5 w-2.5 rounded-full bg-[#C6963A]" />
                  )}
                </div>

                <div
                  className={cn(
                    'mt-4 text-xs font-semibold uppercase tracking-wider',
                    isActive ? 'text-[#C6963A]' : 'text-ink-muted',
                  )}
                >
                  {item.badge}
                </div>

                <h3
                  className={cn(
                    'mt-1 text-body-md font-bold',
                    isActive ? 'text-white' : 'text-[#0B1F3A]',
                  )}
                >
                  {item.label}
                </h3>

                <p
                  className={cn(
                    'mt-2 text-xs line-clamp-2 leading-relaxed',
                    isActive ? 'text-neutral-300' : 'text-ink-muted',
                  )}
                >
                  {item.description}
                </p>
              </div>

              <div
                className={cn(
                  'mt-4 border-t pt-3 text-xs font-semibold flex items-center justify-between',
                  isActive
                    ? 'border-white/10 text-[#C6963A]'
                    : 'border-neutral-100 text-ink-muted group-hover:text-brand-navy',
                )}
              >
                <span>{isActive ? 'Active Channel' : 'Select Channel'}</span>
                <span className="font-mono text-[10px]">
                  {isActive ? '● CONNECTED' : '○ AVAILABLE'}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
