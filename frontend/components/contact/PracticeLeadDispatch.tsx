'use client';

import { ShieldCheck, Clock, CheckCircle2, Zap, FileText } from 'lucide-react';

interface PracticeLeadDispatchProps {
  practiceSlug?: string;
  /** Live practice name — used when the practice has no named lead below (e.g. one added in the admin). */
  practiceName?: string;
  regionSlug?: string;
}

interface DispatchLeadInfo {
  name: string;
  title: string;
  practiceName: string;
  avatarInitials: string;
  deliveryFocus: string;
  typicalTurnaround: string;
}

const DISPATCH_LEADS: Record<string, DispatchLeadInfo> = {
  'ai-bees': {
    name: 'Dr. Aris Thorne',
    title: 'Chief AI Architect & Practice Lead',
    practiceName: 'AI Bees',
    avatarInitials: 'AT',
    deliveryFocus: 'Agentic Workflows, LLM Ops & RAG Pipelines',
    typicalTurnaround: 'Within 2 hours',
  },
  'servicenow-bees': {
    name: 'Marcus Vance',
    title: 'Global ServiceNow Practice Director',
    practiceName: 'ServiceNow Bees',
    avatarInitials: 'MV',
    deliveryFocus: 'ITSM, ITOM, SPM & Workday Multi-Instance Integrations',
    typicalTurnaround: 'Within 3 hours',
  },
  'energy-bees': {
    name: 'Julian Keller',
    title: 'Director of CTRM & Commodities Delivery',
    practiceName: 'Energy Bees',
    avatarInitials: 'JK',
    deliveryFocus: 'Endur/Findur, Allegro, Trade Lifecycle & Risk Engines',
    typicalTurnaround: 'Within 4 hours',
  },
  'quality-bees': {
    name: 'Priya Nair',
    title: 'Enterprise QA & Reliability Lead',
    practiceName: 'Quality Bees',
    avatarInitials: 'PN',
    deliveryFocus: 'Continuous Testing, Chaos Engineering & Performance Verification',
    typicalTurnaround: 'Within 4 hours',
  },
  'talent-bees': {
    name: 'Rahul Sharma',
    title: 'Managing Director - Global Talent Delivery',
    practiceName: 'Talent Bees',
    avatarInitials: 'RS',
    deliveryFocus: 'Pre-Vetted Engineering Pods & Fast-Track Onboarding',
    typicalTurnaround: 'Within 1 business day',
  },
  'digital-bees': {
    name: 'Elena Rostova',
    title: 'Platform Modernization Lead',
    practiceName: 'Digital Bees',
    avatarInitials: 'ER',
    deliveryFocus: 'Cloud-Native Architecture, Distributed Systems & Microservices',
    typicalTurnaround: 'Within 4 hours',
  },
  'marketing-bees': {
    name: 'David Kim',
    title: 'Marketing Technology & Growth Director',
    practiceName: 'Marketing Bees',
    avatarInitials: 'DK',
    deliveryFocus: 'MarTech Stacks, Customer Data Platforms & Omnichannel Engagements',
    typicalTurnaround: 'Within 4 hours',
  },
};

const DEFAULT_DISPATCH: DispatchLeadInfo = {
  name: 'Client Solutions Directorate',
  title: 'Executive Client Engagement Desk',
  practiceName: 'Cross-Practice Solutions',
  avatarInitials: 'TB',
  deliveryFocus: 'Multi-Disciplinary Scoping & Regional Pod Sourcing',
  typicalTurnaround: 'Under 4 hours',
};

export default function PracticeLeadDispatch({ practiceSlug, practiceName, regionSlug }: PracticeLeadDispatchProps) {
  const lead =
    practiceSlug && DISPATCH_LEADS[practiceSlug]
      ? { ...DISPATCH_LEADS[practiceSlug], practiceName: practiceName ?? DISPATCH_LEADS[practiceSlug].practiceName }
      : { ...DEFAULT_DISPATCH, practiceName: practiceName ?? DEFAULT_DISPATCH.practiceName };

  const getRegionLabel = (slug?: string) => {
    switch (slug) {
      case 'india':
        return 'Gurugram Center of Excellence (ODC)';
      case 'usa':
        return 'Chicago US Delivery Hub';
      case 'singapore':
        return 'Singapore APAC Financial Node';
      case 'uae':
        return 'Dubai DIFC Sovereign Cloud Node';
      default:
        return 'Global Unified Delivery Network';
    }
  };

  return (
    <div className="flex flex-col gap-5 rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-sm">
      {/* Dispatch Telemetry Header */}
      <div className="border-b border-neutral-100 pb-4">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 text-label-sm font-semibold uppercase tracking-wider text-brand-gold-deep">
            <Zap className="h-3.5 w-3.5" />
            Dispatch Telemetry
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Lead On-Duty
          </span>
        </div>
        <h3 className="mt-2 text-body-md font-bold text-[#0B1F3A]">
          Accountable Practice Routing
        </h3>
        <p className="mt-1 text-xs text-ink-muted">
          Your request bypasses generic sales queues and reaches practice leadership directly.
        </p>
      </div>

      {/* Accountable Leader Card */}
      <div className="flex items-center gap-3.5 rounded-xl border border-neutral-100 bg-[#F8F9FF] p-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#0B1F3A] font-mono text-sm font-bold text-[#C6963A]">
          {lead.avatarInitials}
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-xs font-semibold uppercase tracking-wider text-brand-gold-deep">
            {lead.practiceName}
          </div>
          <div className="truncate text-body-sm font-bold text-[#0B1F3A]">
            {lead.name}
          </div>
          <div className="truncate text-xs text-ink-muted">
            {lead.title}
          </div>
        </div>
      </div>

      {/* Dispatch Details */}
      <div className="space-y-2.5 text-xs">
        <div className="flex items-start justify-between border-b border-neutral-100 pb-2">
          <span className="text-ink-muted">Target Node:</span>
          <span className="font-semibold text-[#0B1F3A] text-right">
            {getRegionLabel(regionSlug)}
          </span>
        </div>
        <div className="flex items-start justify-between border-b border-neutral-100 pb-2">
          <span className="text-ink-muted">Domain Specialization:</span>
          <span className="max-w-[190px] font-medium text-ink text-right">
            {lead.deliveryFocus}
          </span>
        </div>
        <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
          <span className="text-ink-muted">Response SLA:</span>
          <span className="inline-flex items-center gap-1 font-mono font-bold text-brand-navy">
            <Clock className="h-3 w-3 text-brand-gold-deep" />
            {lead.typicalTurnaround}
          </span>
        </div>
      </div>

      {/* Guarantees Checklist */}
      <div className="rounded-xl border border-neutral-100 bg-neutral-50/70 p-4">
        <div className="text-xs font-bold uppercase tracking-wider text-[#0B1F3A] mb-2.5">
          Delivery Governance Checklist
        </div>
        <ul className="space-y-2 text-xs text-ink-muted">
          <li className="flex items-center gap-2">
            <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-600" />
            <span>Pre-scoping mutual NDA executed upon request</span>
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-600" />
            <span>Dedicated technical squad CV portfolio in 24 hrs</span>
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-600" />
            <span>Direct consultation with practice architects, not sales reps</span>
          </li>
          <li className="flex items-center gap-2">
            <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-brand-navy" />
            <span>SOC2 Type II and ISO 27001 governed infrastructure</span>
          </li>
        </ul>
      </div>

      {/* Direct NDA Note */}
      <div className="flex items-center gap-2 text-[11px] text-ink-muted">
        <FileText className="h-3.5 w-3.5 text-brand-gold-deep shrink-0" />
        <span>Need an NDA before sharing RFP specs? Check the box in the form.</span>
      </div>
    </div>
  );
}
