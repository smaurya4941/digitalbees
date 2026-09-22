import { PhoneCall, Mail, MessageSquare, ShieldAlert, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function ExistingClientShortcut() {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-[#C6963A]/40 bg-[#0B1F3A] p-7 text-white shadow-xl md:p-9">
      {/* Subtle background glow */}
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#C6963A]/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />

      <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        {/* Left Info */}
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#C6963A]/50 bg-[#C6963A]/15 px-3 py-1 text-label-sm font-semibold uppercase tracking-wider text-[#C6963A]">
            <ShieldAlert className="h-3.5 w-3.5" />
            Active Engagements & Escalation
          </div>
          <h2 className="mt-3 text-[26px] font-extrabold tracking-tight text-white sm:text-[32px]">
            Already a TeamBees Client?
          </h2>
          <p className="mt-2 text-body-sm text-neutral-300 leading-relaxed">
            Existing clients have direct priority routing. Bypass triage forms for immediate pod expansion, contract renewals, or 24/7 mission-critical production support.
          </p>
        </div>

        {/* Right Actions Grid */}
        <div className="flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
          <a
            href="tel:+18008869600"
            className="group flex items-center gap-3.5 rounded-2xl border border-white/10 bg-white/5 px-5 py-3.5 transition-all hover:border-[#C6963A] hover:bg-white/10"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#C6963A] text-[#0B1F3A] transition-transform group-hover:scale-105">
              <PhoneCall className="h-5 w-5" />
            </div>
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-neutral-300">
                Direct Priority Line
              </div>
              <div className="font-mono text-body-sm font-bold text-white">
                +1 (800) 886 9600
              </div>
            </div>
          </a>

          <a
            href="mailto:client-support@teambeescorp.com"
            className="group flex items-center gap-3.5 rounded-2xl border border-white/10 bg-white/5 px-5 py-3.5 transition-all hover:border-[#C6963A] hover:bg-white/10"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-[#C6963A] transition-transform group-hover:scale-105">
              <Mail className="h-5 w-5" />
            </div>
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-neutral-300">
                Priority NOC Desk
              </div>
              <div className="font-mono text-body-sm font-bold text-white">
                client-support@teambeescorp.com
              </div>
            </div>
          </a>
        </div>
      </div>

      {/* Slack Connect & Portal Strip */}
      <div className="relative z-10 mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-5 text-xs text-neutral-300">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-[#C6963A]" />
          <span>Have an existing Slack Connect shared channel? Ping your dedicated Account Executive directly.</span>
        </div>
        <Link
          href="/company/our-story"
          className="inline-flex items-center gap-1 font-semibold text-[#C6963A] hover:underline"
        >
          Explore Company Milestones <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
