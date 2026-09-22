'use client';

import { useState } from 'react';
import Image from 'next/image';
import { EMPLOYEE_STORIES_TEMPLATE } from '@/lib/data/template-careers';

export default function CareersStories() {
  const [showPreview, setShowPreview] = useState(false);

  return (
    <section id="culture" className="py-16 md:py-24 bg-surface-ivory border-b border-hairline scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div className="max-w-3xl">
            <span className="font-mono text-xs text-brand-gold font-semibold tracking-wider uppercase block mb-3">
              Voices of TeamBees
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-ink tracking-tight mb-4">
              Real Stories from the Engineering Frontline
            </h2>
            <p className="text-lg text-ink-muted leading-relaxed">
              How our practice specialists solve high-throughput enterprise challenges with dedicated pod autonomy and zero bureaucracy.
            </p>
          </div>

          <div className="shrink-0">
            <button
              type="button"
              onClick={() => setShowPreview((prev) => !prev)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-hairline-strong bg-white dark:bg-white/10 hover:border-brand-gold text-xs font-mono text-ink transition-all shadow-sm"
            >
              <span className={`w-2 h-2 rounded-full ${showPreview ? 'bg-brand-gold' : 'bg-gray-400'}`} />
              <span>{showPreview ? 'Hide Preview Stories' : 'Preview Story Cards (QA Mode)'}</span>
            </button>
          </div>
        </div>

        {/* Content Gap Staging State if not in Preview */}
        {!showPreview ? (
          <div className="p-8 sm:p-12 rounded-2xl bg-white dark:bg-white/5 border border-hairline text-center max-w-3xl mx-auto shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-brand-gold/15 text-brand-gold mx-auto flex items-center justify-center border border-brand-gold/30 mb-4">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-gold/10 text-brand-gold font-mono text-xs font-semibold uppercase tracking-wider mb-3">
              Editorial Content Notice
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-ink mb-2">
              Authentic Employee Stories Being Sourced
            </h3>
            <p className="text-sm text-ink-muted leading-relaxed max-w-xl mx-auto mb-6">
              In accordance with our editorial authenticity policy, employee quotes and video profiles are undergoing candidate authorization and marketing sign-off.
            </p>
            <button
              type="button"
              onClick={() => setShowPreview(true)}
              className="px-5 py-2.5 rounded-lg bg-brand-navy hover:bg-brand-navy-light text-white font-medium text-xs transition-all shadow-sm"
            >
              Preview Architecture Layout
            </button>
          </div>
        ) : (
          <>
            <div className="mb-6 p-3.5 rounded-xl bg-brand-gold/15 border border-brand-gold/30 flex items-center justify-between text-xs font-mono text-ink">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-brand-gold animate-pulse" />
                <span className="font-bold text-brand-gold uppercase">STAGING PREVIEW:</span>
                <span>Displaying Google Stitch story card architecture for candidate review.</span>
              </div>
              <button
                type="button"
                onClick={() => setShowPreview(false)}
                className="underline text-ink-muted hover:text-ink"
              >
                Close Preview
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {EMPLOYEE_STORIES_TEMPLATE.map((story) => (
                <div
                  key={story.id}
                  className="rounded-2xl bg-white dark:bg-white/5 border border-hairline hover:border-brand-gold/50 transition-all p-7 flex flex-col justify-between shadow-sm group"
                >
                  <div>
                    {/* Impact Tag */}
                    <div className="flex items-center justify-between mb-5">
                      <span className="px-2.5 py-0.5 rounded bg-brand-navy/5 dark:bg-white/10 text-brand-navy dark:text-brand-gold border border-brand-gold/25 font-mono text-[10px] font-semibold tracking-wider uppercase">
                        {story.impact_tag}
                      </span>
                      <span className="text-brand-gold text-2xl font-serif leading-none">&ldquo;</span>
                    </div>

                    <blockquote className="text-sm text-ink leading-relaxed mb-6 italic">
                      &ldquo;{story.quote}&rdquo;
                    </blockquote>
                  </div>

                  <div className="pt-4 border-t border-hairline flex items-center gap-3.5">
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-brand-navy/5 shrink-0 border border-hairline">
                      <Image
                        src={story.photo_url}
                        alt={story.name}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-bold text-ink truncate group-hover:text-brand-navy transition-colors">
                        {story.name}
                      </div>
                      <div className="text-xs text-brand-gold font-medium truncate">
                        {story.role}
                      </div>
                      <div className="text-[11px] text-ink-muted font-mono truncate">
                        {story.location}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
