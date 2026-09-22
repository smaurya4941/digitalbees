'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { routes } from '@/config/routes';
import type { ServiceClusterPage } from '@/types/service';
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs';

interface ServiceClusterTemplateProps {
  page: ServiceClusterPage;
  pillarName: string;
}

export function ServiceClusterTemplate({ page, pillarName }: ServiceClusterTemplateProps) {
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  const breadcrumbs = [
    { label: 'Home', href: routes.home() },
    { label: 'Services', href: routes.services() },
    { label: pillarName, href: routes.servicePillar(page.pillarSlug) },
    { label: page.title, href: routes.serviceCluster(page.pillarSlug, page.slug) },
  ];

  // FAQ Schema JSON-LD for Google Rich Results
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: page.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-[#0B1F3A] font-sans antialiased">
      {/* FAQ JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* 1. Breadcrumbs */}
      <nav className="border-b border-[#C4C6CE]/30 bg-white py-3 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <Breadcrumbs items={breadcrumbs} />
        </div>
      </nav>

      {/* 2. Hero Section */}
      <section className="relative overflow-hidden bg-[#0B1F3A] text-white pt-16 pb-20 md:pt-20 md:pb-24 px-4 md:px-8">
        {/* Subtle honeycomb dot pattern */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(rgba(198, 150, 58, 0.35) 1.5px, transparent 1.5px)',
            backgroundSize: '24px 24px',
          }}
        />

        <div className="relative max-w-7xl mx-auto">
          <div className="max-w-3xl">
            {/* Eyebrow badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-[#C6963A]/40 bg-[#C6963A]/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-[#C6963A] mb-6">
              <span className="h-1.5 w-1.5 rounded-full bg-[#C6963A] animate-pulse" />
              {page.category} Staffing &middot; Top 3% Pre-Vetted
            </div>

            <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              {page.h1}
            </h1>

            <p className="mt-4 text-xl md:text-2xl font-semibold text-[#E9D9AE]">
              {page.heroHeadline}
            </p>

            {/* Direct intent answer (40-60 words as required by Content Guidelines) */}
            <p className="mt-4 text-base md:text-lg text-slate-300 leading-relaxed max-w-2xl">
              {page.heroContent}
            </p>

            {/* Dual CTAs */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/contact-us"
                className="inline-flex items-center justify-center rounded-lg bg-[#C6963A] px-7 py-3.5 text-sm font-bold text-[#071527] shadow-lg shadow-[#C6963A]/20 transition-all hover:bg-[#D4AF37] hover:scale-[1.02]"
              >
                Schedule a Consultation
                <span className="material-symbols-outlined ml-2 text-base">arrow_forward</span>
              </Link>
              <a
                href="#hiring-models"
                className="inline-flex items-center justify-center rounded-lg border border-white/20 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur transition-all hover:bg-white/10"
              >
                View Hiring Models
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Proof Bar */}
      <section className="border-b border-[#C4C6CE]/30 bg-[#071527] py-6 px-4 md:px-8 text-white">
        <div className="max-w-7xl mx-auto grid grid-cols-2 gap-6 md:grid-cols-4">
          <div className="flex flex-col items-center text-center">
            <span className="text-2xl md:text-3xl font-extrabold text-[#C6963A]">48 Hours</span>
            <span className="text-xs uppercase tracking-wider text-slate-400 mt-1">Shortlist Turnaround</span>
          </div>
          <div className="flex flex-col items-center text-center">
            <span className="text-2xl md:text-3xl font-extrabold text-[#C6963A]">Top 3%</span>
            <span className="text-xs uppercase tracking-wider text-slate-400 mt-1">Pre-Vetted Senior Engineers</span>
          </div>
          <div className="flex flex-col items-center text-center">
            <span className="text-2xl md:text-3xl font-extrabold text-[#C6963A]">Up to 40%</span>
            <span className="text-xs uppercase tracking-wider text-slate-400 mt-1">Cost Advantage vs Domestic</span>
          </div>
          <div className="flex flex-col items-center text-center">
            <span className="text-2xl md:text-3xl font-extrabold text-[#C6963A]">Zero Risk</span>
            <span className="text-xs uppercase tracking-wider text-slate-400 mt-1">1-Week Trial Guarantee</span>
          </div>
        </div>
      </section>

      {/* 4. Why Choose Section */}
      <section className="py-16 md:py-20 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-[#C6963A]">
            VALUE PROPOSITION
          </span>
          <h2 className="mt-2 text-2xl md:text-4xl font-extrabold text-[#0B1F3A]">
            {page.whyPoints.title}
          </h2>
          <p className="mt-3 text-base text-[#44474d]">
            {page.whyPoints.description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {page.whyPoints.points.map((pt, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-[#C4C6CE]/40 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-[#C6963A]/60"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#0B1F3A] text-[#C6963A] mb-4">
                <span className="material-symbols-outlined text-2xl">{pt.icon ?? 'verified'}</span>
              </div>
              <h3 className="text-lg font-bold text-[#0B1F3A]">{pt.title}</h3>
              <p className="mt-2 text-sm text-[#44474d] leading-relaxed">{pt.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Hiring Models */}
      {page.hiringModels && page.hiringModels.length > 0 && (
        <section id="hiring-models" className="bg-[#f2f3f9] py-16 md:py-20 px-4 md:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <span className="text-xs font-bold uppercase tracking-widest text-[#C6963A]">
                FLEXIBLE ENGAGEMENT
              </span>
              <h2 className="mt-2 text-2xl md:text-4xl font-extrabold text-[#0B1F3A]">
                Our Dedicated Hiring Models
              </h2>
              <p className="mt-3 text-base text-[#44474d]">
                Whether you need an embedded individual developer or a complete delivery squad, we tailor our model to your workflow.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {page.hiringModels.map((model, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-[#C4C6CE]/40 bg-white p-8 shadow-sm flex flex-col justify-between transition-all hover:shadow-lg hover:border-[#C6963A]/80"
                >
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-[#C6963A] mb-2">
                      {model.subtitle}
                    </div>
                    <h3 className="text-xl font-bold text-[#0B1F3A]">{model.title}</h3>
                    <p className="mt-3 text-sm text-[#44474d] leading-relaxed">
                      {model.description}
                    </p>

                    <div className="mt-6 border-t border-[#C4C6CE]/30 pt-6">
                      <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
                        Included Features
                      </div>
                      <ul className="space-y-2.5">
                        {model.features.map((feat, fIdx) => (
                          <li key={fIdx} className="flex items-start text-sm text-[#0B1F3A]">
                            <span className="material-symbols-outlined text-base text-[#2E7D5B] mr-2 shrink-0">
                              check_circle
                            </span>
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-[#C4C6CE]/20">
                    <div className="rounded-lg bg-[#0B1F3A]/5 p-3 text-xs text-[#0B1F3A] mb-4">
                      <strong>Best For:</strong> {model.bestFor}
                    </div>
                    <Link
                      href="/contact-us"
                      className="inline-flex w-full items-center justify-center rounded-lg bg-[#0B1F3A] py-3 text-sm font-semibold text-white transition-all hover:bg-[#132B4F]"
                    >
                      Choose Model
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 6. Related Roles & Developer Grid */}
      {page.relatedRoles && page.relatedRoles.length > 0 && (
        <section className="py-16 md:py-20 px-4 md:px-8 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#C6963A]">
                CROSS-DISCIPLINARY BENCH
              </span>
              <h2 className="mt-2 text-2xl md:text-3xl font-extrabold text-[#0B1F3A]">
                Frequently Hired Dedicated Roles
              </h2>
            </div>
            <Link
              href={routes.servicePillar('staff-augmentation')}
              className="mt-4 md:mt-0 text-sm font-bold text-[#C6963A] hover:underline inline-flex items-center"
            >
              View All 30+ Talent Categories
              <span className="material-symbols-outlined ml-1 text-sm">arrow_forward</span>
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {page.relatedRoles.map((role) => (
              <Link
                key={role.slug}
                href={routes.serviceCluster(page.pillarSlug, role.slug)}
                className="rounded-xl border border-[#C4C6CE]/40 bg-white p-4 text-center transition-all hover:border-[#C6963A] hover:shadow-md group"
              >
                <div className="flex h-10 w-10 mx-auto items-center justify-center rounded-lg bg-[#0B1F3A]/5 text-[#0B1F3A] group-hover:bg-[#C6963A] group-hover:text-[#071527] transition-colors mb-2">
                  <span className="material-symbols-outlined text-xl">code</span>
                </div>
                <div className="text-sm font-bold text-[#0B1F3A] group-hover:text-[#C6963A] transition-colors">
                  {role.name}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 7. Process Steps Timeline */}
      <section className="bg-[#0B1F3A] text-white py-16 md:py-20 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-widest text-[#C6963A]">
              DELIVERY PROTOCOL
            </span>
            <h2 className="mt-2 text-2xl md:text-4xl font-extrabold text-white">
              How Our Hiring Process Works
            </h2>
            <p className="mt-3 text-base text-slate-300">
              From initial technical requirement to daily sprint commits in under 7 business days.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {page.processSteps.map((step) => (
              <div
                key={step.step}
                className="relative rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur transition-all hover:border-[#C6963A]/60"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#C6963A] font-bold text-xs text-[#071527]">
                    0{step.step}
                  </span>
                  <h3 className="text-lg font-bold text-white">{step.title}</h3>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Comparison Table */}
      {page.comparisonTable && (
        <section className="py-16 md:py-20 px-4 md:px-8 max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-[#C6963A]">
              EVALUATION MATRIX
            </span>
            <h2 className="mt-2 text-2xl md:text-4xl font-extrabold text-[#0B1F3A]">
              {page.comparisonTable.title}
            </h2>
            <p className="mt-3 text-base text-[#44474d]">
              {page.comparisonTable.subtitle}
            </p>
          </div>

          <div className="overflow-x-auto rounded-xl border border-[#C4C6CE]/40 bg-white shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#0B1F3A] text-white">
                  <th className="py-4 px-6 font-bold text-sm tracking-wider w-1/4">
                    {page.comparisonTable.headers[0]}
                  </th>
                  <th className="py-4 px-6 font-bold text-sm tracking-wider text-slate-300 w-3/8">
                    {page.comparisonTable.headers[1]}
                  </th>
                  <th className="py-4 px-6 font-bold text-sm tracking-wider text-[#C6963A] w-3/8">
                    {page.comparisonTable.headers[2]}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#C4C6CE]/30 text-sm">
                {page.comparisonTable.rows.map((row, rIdx) => (
                  <tr key={rIdx} className={rIdx % 2 === 1 ? 'bg-slate-50' : 'bg-white'}>
                    <td className="py-4 px-6 font-bold text-[#0B1F3A]">{row.criteria}</td>
                    <td className="py-4 px-6 text-[#44474d]">{row.traditional}</td>
                    <td className="py-4 px-6 font-medium text-[#0B1F3A] bg-[#C6963A]/5">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-base text-[#2E7D5B]">
                          check_circle
                        </span>
                        {row.dedicated}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* 9. Technologies Our Developers Work With */}
      <section className="bg-slate-50 py-16 px-4 md:px-8 border-y border-[#C4C6CE]/30">
        <div className="max-w-7xl mx-auto text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-[#C6963A]">
            TECH STACK ALIGNMENT
          </span>
          <h2 className="mt-2 text-2xl md:text-3xl font-extrabold text-[#0B1F3A]">
            Technologies & Frameworks We Deliver
          </h2>
          <p className="mt-2 text-sm text-[#44474d] max-w-xl mx-auto">
            Our engineers build with modern, maintainable stacks and integrate directly into your tooling.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {page.technologies.map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-[#C4C6CE]/50 bg-white px-5 py-2 text-sm font-semibold text-[#0B1F3A] shadow-sm hover:border-[#C6963A] transition-colors"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* 10. Frequently Asked Questions (FAQ Accordion) */}
      <section className="py-16 md:py-20 px-4 md:px-8 max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-[#C6963A]">
            COMMON QUESTIONS
          </span>
          <h2 className="mt-2 text-2xl md:text-4xl font-extrabold text-[#0B1F3A]">
            Frequently Asked Questions
          </h2>
          <p className="mt-2 text-sm text-[#44474d]">
            Everything you need to know about hiring, billing, and day-to-day governance.
          </p>
        </div>

        <div className="space-y-4">
          {page.faqs.map((faq, fIdx) => {
            const isOpen = activeFaq === fIdx;
            return (
              <div
                key={fIdx}
                className="rounded-xl border border-[#C4C6CE]/40 bg-white overflow-hidden shadow-sm"
              >
                <button
                  type="button"
                  onClick={() => setActiveFaq(isOpen ? null : fIdx)}
                  className="w-full text-left py-4 px-6 flex items-center justify-between font-bold text-base text-[#0B1F3A] hover:text-[#C6963A] transition-colors"
                >
                  <span>{faq.question}</span>
                  <span className="material-symbols-outlined ml-4 shrink-0 transition-transform duration-200">
                    {isOpen ? 'expand_less' : 'expand_more'}
                  </span>
                </button>
                {isOpen && (
                  <div className="px-6 pb-5 pt-1 text-sm text-[#44474d] leading-relaxed border-t border-slate-100">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 11. Final Conversion CTA Band */}
      <section className="bg-[#0B1F3A] text-white py-16 px-4 md:px-8 border-t border-[#C6963A]/40 text-center relative overflow-hidden">
        <div className="relative max-w-3xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-[#C6963A]">
            FAST-TRACK YOUR HIRING
          </span>
          <h2 className="mt-2 text-3xl md:text-4xl font-extrabold text-white">
            {page.cta.title}
          </h2>
          <p className="mt-4 text-base text-slate-300">
            {page.cta.subtitle}
          </p>
          <div className="mt-8 flex justify-center">
            <Link
              href={page.cta.buttonHref}
              className="inline-flex items-center justify-center rounded-lg bg-[#C6963A] px-8 py-4 text-base font-bold text-[#071527] shadow-xl shadow-[#C6963A]/20 transition-all hover:bg-[#D4AF37] hover:scale-105"
            >
              {page.cta.buttonText}
              <span className="material-symbols-outlined ml-2 text-lg">arrow_forward</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
