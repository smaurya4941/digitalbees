'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { routes } from '@/config/routes';
import type { ServicePillar, ServiceClusterCategory } from '@/types/service';
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs';

interface ServicePillarTemplateProps {
  pillar: ServicePillar;
}

export function ServicePillarTemplate({ pillar }: ServicePillarTemplateProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const breadcrumbs = [
    { label: 'Home', href: routes.home() },
    { label: 'Services', href: routes.services() },
    { label: pillar.name, href: routes.servicePillar(pillar.slug) },
  ];

  const filteredCategories =
    selectedCategory === 'all'
      ? pillar.clusterCategories
      : pillar.clusterCategories.filter((c) => c.id === selectedCategory);

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-[#0B1F3A] font-sans antialiased">
      {/* 1. Breadcrumbs */}
      <nav className="border-b border-[#C4C6CE]/30 bg-white py-3 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <Breadcrumbs items={breadcrumbs} />
        </div>
      </nav>

      {/* 2. Hero Section */}
      <section className="relative overflow-hidden bg-[#0B1F3A] text-white pt-16 pb-20 md:pt-20 md:pb-24 px-4 md:px-8">
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(rgba(198, 150, 58, 0.35) 1.5px, transparent 1.5px)',
            backgroundSize: '24px 24px',
          }}
        />

        <div className="relative max-w-7xl mx-auto">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#C6963A]/40 bg-[#C6963A]/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-[#C6963A] mb-6">
              <span className="h-1.5 w-1.5 rounded-full bg-[#C6963A] animate-pulse" />
              {pillar.hero.eyebrow}
            </div>

            <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              {pillar.hero.title}
            </h1>

            <p className="mt-4 text-xl font-semibold text-[#E9D9AE]">
              {pillar.tagline}
            </p>

            <p className="mt-4 text-base md:text-lg text-slate-300 leading-relaxed max-w-2xl">
              {pillar.description}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href={pillar.hero.primaryCta.href}
                className="inline-flex items-center justify-center rounded-lg bg-[#C6963A] px-7 py-3.5 text-sm font-bold text-[#071527] shadow-lg shadow-[#C6963A]/20 transition-all hover:bg-[#D4AF37] hover:scale-[1.02]"
              >
                {pillar.hero.primaryCta.text}
                <span className="material-symbols-outlined ml-2 text-base">arrow_forward</span>
              </Link>
              <a
                href="#categories"
                className="inline-flex items-center justify-center rounded-lg border border-white/20 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur transition-all hover:bg-white/10"
              >
                {pillar.hero.secondaryCta.text}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Proof Bar */}
      <section className="border-b border-[#C4C6CE]/30 bg-[#071527] py-6 px-4 md:px-8 text-white">
        <div className="max-w-7xl mx-auto grid grid-cols-2 gap-6 md:grid-cols-4">
          {pillar.stats.map((stat, sIdx) => (
            <div key={sIdx} className="flex flex-col items-center text-center">
              <span className="text-2xl md:text-3xl font-extrabold text-[#C6963A]">{stat.value}</span>
              <span className="text-xs uppercase tracking-wider text-slate-400 mt-1">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Categorized Landing Pages Hub */}
      <section id="categories" className="py-16 md:py-24 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-6 border-b border-[#C4C6CE]/30">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#C6963A]">
              PROGRAMMATIC DIRECTORY
            </span>
            <h2 className="mt-2 text-2xl md:text-4xl font-extrabold text-[#0B1F3A]">
              Explore {pillar.name} Solutions & Clusters
            </h2>
            <p className="mt-2 text-base text-[#44474d]">
              Browse our specialized landing pages by model, skill, discipline, or industry.
            </p>
          </div>

          {/* Fast Category Filter Chips */}
          <div className="mt-6 md:mt-0 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setSelectedCategory('all')}
              className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all ${
                selectedCategory === 'all'
                  ? 'bg-[#0B1F3A] text-white shadow-sm'
                  : 'bg-slate-100 text-[#44474d] hover:bg-slate-200'
              }`}
            >
              All Categories
            </button>
            {pillar.clusterCategories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-[#0B1F3A] text-white shadow-sm'
                    : 'bg-slate-100 text-[#44474d] hover:bg-slate-200'
                }`}
              >
                {cat.title.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Categories and Cards */}
        <div className="space-y-16">
          {filteredCategories.map((category) => (
            <div key={category.id}>
              <div className="mb-6">
                <h3 className="text-xl md:text-2xl font-bold text-[#0B1F3A]">
                  {category.title}
                </h3>
                <p className="text-sm text-[#44474d] mt-1">{category.description}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.items.map((item) => (
                  <Link
                    key={item.slug}
                    href={routes.serviceCluster(pillar.slug, item.slug)}
                    className="group relative rounded-xl border border-[#C4C6CE]/40 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-[#C6963A]"
                  >
                    {item.badge && (
                      <span className="absolute top-4 right-4 rounded-full bg-[#C6963A]/15 text-[#9C7326] px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider">
                        {item.badge}
                      </span>
                    )}
                    <h4 className="text-lg font-bold text-[#0B1F3A] group-hover:text-[#C6963A] transition-colors">
                      {item.name}
                    </h4>
                    <p className="mt-2 text-sm text-[#44474d] line-clamp-2">
                      {item.description}
                    </p>
                    <div className="mt-4 flex items-center text-xs font-bold text-[#C6963A] group-hover:translate-x-1 transition-transform">
                      <span>Explore Page</span>
                      <span className="material-symbols-outlined ml-1 text-sm">arrow_forward</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Cross-Link Bridge to Sibling Practice Hub */}
      <section className="bg-slate-50 border-t border-[#C4C6CE]/30 py-16 px-4 md:px-8">
        <div className="max-w-7xl mx-auto rounded-2xl bg-[#071527] p-8 md:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#C6963A]">
              ENTERPRISE PRACTICE SYNERGY
            </span>
            <h3 className="mt-2 text-2xl md:text-3xl font-extrabold text-white">
              Looking for our Core Practice Hub?
            </h3>
            <p className="mt-2 text-sm text-slate-300 max-w-xl">
              Explore the master Talent Bees practice overview, enterprise governance frameworks, and global client case studies.
            </p>
          </div>
          <Link
            href="/practices/talent-bees"
            className="shrink-0 rounded-lg bg-[#C6963A] px-6 py-3 text-sm font-bold text-[#071527] hover:bg-[#D4AF37] transition-all"
          >
            Visit Talent Bees Practice Hub &rarr;
          </Link>
        </div>
      </section>

      {/* 6. Conversion CTA Band */}
      <section className="bg-[#0B1F3A] text-white py-16 px-4 md:px-8 text-center border-t border-[#C6963A]/40">
        <div className="max-w-3xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-[#C6963A]">
            GET STARTED TODAY
          </span>
          <h2 className="mt-2 text-3xl md:text-4xl font-extrabold text-white">
            Ready to Accelerate Your Engineering Velocity?
          </h2>
          <p className="mt-4 text-base text-slate-300">
            Tell us about your technical roadmap and team requirements. Receive a curated shortlist within 48 hours.
          </p>
          <div className="mt-8 flex justify-center">
            <Link
              href="/contact-us"
              className="inline-flex items-center justify-center rounded-lg bg-[#C6963A] px-8 py-4 text-base font-bold text-[#071527] shadow-xl shadow-[#C6963A]/20 transition-all hover:bg-[#D4AF37] hover:scale-105"
            >
              Book a Strategy Call
              <span className="material-symbols-outlined ml-2 text-lg">arrow_forward</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
