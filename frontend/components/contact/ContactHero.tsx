import Link from 'next/link';
import { ShieldCheck, Clock, Users, FileLock2 } from 'lucide-react';

export default function ContactHero() {
  return (
    <section className="relative overflow-hidden border-b border-neutral-200 bg-gradient-to-b from-[#F8F9FF] to-white pt-12 pb-16 md:pt-16 md:pb-20">
      <div className="mx-auto max-w-container-max px-margin-mobile md:px-margin-desktop">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-label-sm text-ink-muted">
          <Link href="/" className="transition-colors hover:text-ink">
            Home
          </Link>
          <span>/</span>
          <span className="font-semibold text-brand-navy">Contact</span>
        </nav>

        <div className="max-w-3xl">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 rounded-full border border-[#C6963A]/30 bg-[#C6963A]/10 px-3 py-1 text-label-sm font-semibold uppercase tracking-wider text-[#9E6D18]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#C6963A]" />
            Get in Touch
          </div>

          {/* Heading */}
          <h1 className="mt-4 text-[42px] font-extrabold leading-tight tracking-tight text-[#0B1F3A] sm:text-[56px] md:text-[64px]">
            Let&apos;s talk.
          </h1>

          {/* Subheading */}
          <p className="mt-5 text-body-lg text-ink-muted leading-relaxed">
            Whether you are deploying specialized engineering squads, architecting enterprise platform solutions, or inquiring about strategic partnerships, our teams route your message directly to the accountable practice or regional lead.
          </p>
        </div>

        {/* Enterprise Trust Bar */}
        <div className="mt-12 grid grid-cols-2 gap-4 rounded-2xl border border-neutral-200/80 bg-white/90 p-5 shadow-xs backdrop-blur-xs md:grid-cols-4 md:p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-navy/5 text-brand-navy">
              <Clock className="h-5 w-5 text-brand-gold-deep" />
            </div>
            <div>
              <div className="text-body-sm font-bold text-[#0B1F3A]">4-Hour SLA</div>
              <div className="text-xs text-ink-muted">Guaranteed first response</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-navy/5 text-brand-navy">
              <Users className="h-5 w-5 text-brand-gold-deep" />
            </div>
            <div>
              <div className="text-body-sm font-bold text-[#0B1F3A]">Direct Access</div>
              <div className="text-xs text-ink-muted">Accountable practice leads</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-navy/5 text-brand-navy">
              <ShieldCheck className="h-5 w-5 text-brand-gold-deep" />
            </div>
            <div>
              <div className="text-body-sm font-bold text-[#0B1F3A]">SOC2 & ISO 27001</div>
              <div className="text-xs text-ink-muted">Certified data security</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-navy/5 text-brand-navy">
              <FileLock2 className="h-5 w-5 text-brand-gold-deep" />
            </div>
            <div>
              <div className="text-body-sm font-bold text-[#0B1F3A]">100% Mutual NDA</div>
              <div className="text-xs text-ink-muted">Pre-scoping protection</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
