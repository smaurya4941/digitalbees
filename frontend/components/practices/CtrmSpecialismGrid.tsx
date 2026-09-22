import React from 'react';
import Link from 'next/link';

export function CtrmSpecialismGrid() {
  const roles = [
    {
      title: 'Techno-functional consultants',
      desc: 'Front, middle and back office specialists who can talk to a trader and read the code.',
    },
    {
      title: 'Technical consultants & developers',
      desc: 'Java, C#/.NET, PL/SQL, T-SQL, Python and platform-native scripting.',
    },
    {
      title: 'Business analysts',
      desc: 'Requirements, fit-gap, process design and UAT ownership.',
    },
    {
      title: 'Integration & data migration engineers',
      desc: 'Interface build, ETL, reconciliation and zero-downtime cutover.',
    },
    {
      title: 'Trade support analysts',
      desc: 'L2/L3 cover across trading hours, month-end and market close.',
    },
    {
      title: 'Test engineers & automation specialists',
      desc: 'Regression, upgrade and migration assurance across trading engines.',
    },
    {
      title: 'Solution architects & delivery leads',
      desc: 'Programme shape, estimates, vendor management and governance.',
    },
  ];

  const functions = [
    { code: 'FO', title: 'Front Office', desc: 'Pricing & Deal Capture' },
    { code: 'MO', title: 'Middle Office & Risk', desc: 'VaR & Position Limits' },
    { code: 'BO', title: 'Back Office', desc: 'Settlement & Invoicing' },
    { code: 'LOG', title: 'Scheduling & Logistics', desc: 'Pipeline & Nominations' },
    { code: 'DATA', title: 'Market & Reference Data', desc: 'Curves & Volatility Surfaces' },
    { code: 'INT', title: 'Integration & Migration', desc: 'ETL & Broker Feeds' },
    { code: 'REG', title: 'Regulatory & Accounting', desc: 'EMIR, Dodd-Frank, IFRS 9' },
    { code: 'QA', title: 'Test & Release Assurance', desc: 'Regression & Stress Testing' },
  ];

  const platforms = [
    {
      name: 'Endur / Findur',
      summary: 'Trading, operations, risk and finance platform delivery.',
      stack: ['OpenComponents (Java/.NET)', 'AVS / JVS Scripting', 'Connex Integration', 'TPM Workflows'],
    },
    {
      name: 'Aspect, Allegro & RightAngle',
      summary: 'Configuration, interface, and support work across power, gas and refined products.',
      stack: ['Power & Gas Modules', 'Crude & Liquids Architecture', 'Deal Modeling', 'Custom Extensions'],
    },
    {
      name: 'Adjacent Trading Ecosystems',
      summary: 'High-frequency exchanges, broker connectivity, treasury, and enterprise ERP integration.',
      stack: ['Trayport & ICE Feeds', 'Exchange Adapters', 'SAP / Oracle ERP Sync', 'Treasury Systems'],
    },
  ];

  return (
    <section className="w-full bg-[#071527] text-white rounded-3xl p-6 md:p-10 lg:p-12 border border-[#C6963A]/30 shadow-2xl relative overflow-hidden">
      {/* Decorative ambient background */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(rgba(198, 150, 58, 0.4) 1.5px, transparent 1.5px)',
          backgroundSize: '24px 24px',
        }}
      />

      <div className="relative">
        {/* Eyebrow & Headline */}
        <div className="flex items-center gap-2 mb-3">
          <span className="h-2 w-2 rounded-full bg-[#C6963A] animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-widest text-[#C6963A]">
            DOMAIN SPECIALISM &middot; ENERGY TRADING &amp; CTRM
          </span>
        </div>

        <h2 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight">
          Specialist CTRM talent, embedded in your trading technology team
        </h2>
        <p className="mt-2 text-base md:text-lg text-[#E9D9AE] max-w-3xl">
          Resource augmentation for Endur / Findur, Aspect, Allegro and RightAngle programmes &mdash; front, middle and back office.
        </p>

        {/* 3-Column Core Grid */}
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Column 1: Roles We Place (5 cols) */}
          <div className="lg:col-span-5 bg-[#0B1F3A]/80 rounded-2xl p-6 border border-white/10 backdrop-blur">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#C6963A]">
                Roles We Place
              </h3>
              <span className="text-xs text-slate-400">7 Core Disciplines</span>
            </div>
            <ul className="space-y-3.5">
              {roles.map((r, idx) => (
                <li key={idx} className="text-xs leading-relaxed">
                  <span className="font-bold text-white block text-sm mb-0.5">
                    &bull; {r.title}
                  </span>
                  <span className="text-slate-300 pl-3 block">{r.desc}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2 & 3: Functions We Staff & Platforms (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            {/* Functions We Staff */}
            <div className="bg-[#0B1F3A]/80 rounded-2xl p-6 border border-white/10 backdrop-blur">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#C6963A]">
                  Functions We Staff
                </h3>
                <span className="text-xs text-slate-400">Full Trade Lifecycle</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {functions.map((f, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl bg-[#071527] p-3 border border-[#C6963A]/20 hover:border-[#C6963A] transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-base font-extrabold text-[#C6963A]">{f.code}</span>
                      <span className="material-symbols-outlined text-xs text-slate-500">done</span>
                    </div>
                    <div className="text-xs font-bold text-white mt-1 leading-tight">{f.title}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5 leading-tight">{f.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Platforms Our Specialists Work On */}
            <div className="bg-[#0B1F3A]/80 rounded-2xl p-6 border border-white/10 backdrop-blur">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#C6963A]">
                  Platforms Our Specialists Work On
                </h3>
                <span className="text-xs text-slate-400">Tier-1 Commodity Engines</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {platforms.map((p, idx) => (
                  <div key={idx} className="rounded-xl bg-[#071527] p-4 border border-white/10 flex flex-col justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white text-[#E9D9AE] flex items-center gap-1.5">
                        <span className="text-[#C6963A] font-bold">&check;</span>
                        {p.name}
                      </h4>
                      <p className="text-[11px] text-slate-300 mt-1.5 leading-normal">
                        {p.summary}
                      </p>
                    </div>
                    <div className="mt-3 pt-2.5 border-t border-white/10 space-y-1">
                      {p.stack.map((s, sIdx) => (
                        <div key={sIdx} className="text-[10px] text-slate-400 flex items-center gap-1">
                          <span className="h-1 w-1 rounded-full bg-[#C6963A]" />
                          <span>{s}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Engagement Model Banner */}
        <div className="mt-8 rounded-xl bg-[#C6963A] p-4 text-[#071527] flex flex-col sm:flex-row items-center justify-between gap-4 font-bold text-xs md:text-sm">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-lg">verified</span>
            <span>
              STAFF AUGMENTATION &bull; Techno-functional consultants, developers, analysts and support engineers on T&amp;M &bull; Define &rarr; Match &rarr; Embed &rarr; Scale
            </span>
          </div>
          <Link
            href="/contact-us"
            className="shrink-0 rounded-lg bg-[#071527] text-white px-4 py-2 hover:bg-[#0B1F3A] transition-colors"
          >
            Request CTRM Specialists &rarr;
          </Link>
        </div>

        {/* Trademark Disclaimer Footnote */}
        <p className="mt-4 text-[10px] text-slate-400 italic">
          Endur, Findur, Aspect, Allegro and RightAngle are trademarks of ION Group and/or its affiliates. TeamBees is an independent services provider and is not affiliated with, endorsed by or sponsored by any software vendor named.
        </p>
      </div>
    </section>
  );
}
