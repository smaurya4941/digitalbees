import Link from 'next/link';

interface ArticleItem {
  tag: string;
  tagColor: string;
  tagBg: string;
  readTime: string;
  title: string;
  excerpt: string;
  href: string;
}

const ARTICLES: ArticleItem[] = [
  {
    tag: 'AI & Automation',
    tagColor: '#d8b4fe',
    tagBg: 'rgba(107, 79, 161, 0.25)',
    readTime: '5 min read',
    title: 'Deploying Multi-Agent Systems in Regulated Financial Environments',
    excerpt: 'Cryptographic ledger state verification and deterministic human-in-the-loop audit trails.',
    href: '/blog',
  },
  {
    tag: 'ServiceNow',
    tagColor: '#6ee7b7',
    tagBg: 'rgba(46, 107, 79, 0.25)',
    readTime: '7 min read',
    title: 'Moving 70%+ Custom Fields to OOTB: A CMDB Overhaul Case Study',
    excerpt: 'How enterprise architects pruned 8 years of technical debt in Washington DC release.',
    href: '/blog',
  },
  {
    tag: 'Workforce Strategy',
    tagColor: '#93c5fd',
    tagBg: 'rgba(59, 130, 246, 0.25)',
    readTime: '4 min read',
    title: 'Why Modern Enterprise Teams Combine Headcount with Delivery Pods',
    excerpt: 'The strategic difference between pure staff-aug and accountable technical squads.',
    href: '/blog',
  },
];

interface Props {
  onClose: () => void;
}

export function InsightsMegaMenu({ onClose }: Props) {
  return (
    <div className="w-full bg-[#0B1F3A]/98 backdrop-blur-xl border-b border-[#C6963A]/30 shadow-[0_25px_60px_rgba(0,0,0,0.6)] text-white">
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12">
        {/* Left Column: Resource Navigation (4 cols) */}
        <div className="lg:col-span-4 p-7 border-b lg:border-b-0 lg:border-r border-white/10 space-y-5 bg-[#071527]/70">
          <div>
            <span className="text-[11px] font-mono text-[#C6963A] uppercase tracking-wider font-semibold">
              // Research &amp; Knowledge Base
            </span>
            <h3 className="text-lg font-bold text-white mt-1">Direct from the engineering floor.</h3>
            <p className="text-xs text-white/60 mt-1">
              Field-tested insights from our 500+ deployed technologists.
            </p>
          </div>

          <div className="space-y-2">
            <Link
              href="/blog"
              onClick={onClose}
              className="p-3 rounded-lg bg-white/[0.02] hover:bg-white/5 border border-white/5 hover:border-[#C6963A]/40 flex items-center justify-between group transition"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-[#071527] text-[#C6963A] border border-white/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[18px]">article</span>
                </div>
                <div>
                  <div className="text-sm font-bold text-white group-hover:text-[#C6963A] transition">
                    Technical Blog &amp; Notes
                  </div>
                  <div className="text-[11px] text-white/50">Weekly architectural deep dives</div>
                </div>
              </div>
              <span className="material-symbols-outlined text-[16px] text-white/70 group-hover:text-[#C6963A] group-hover:translate-x-1 transition-transform">
                chevron_right
              </span>
            </Link>

            <Link
              href="/resources"
              onClick={onClose}
              className="p-3 rounded-lg bg-white/[0.02] hover:bg-white/5 border border-white/5 hover:border-[#C6963A]/40 flex items-center justify-between group transition"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-[#071527] text-[#C6963A] border border-white/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[18px]">menu_book</span>
                </div>
                <div>
                  <div className="text-sm font-bold text-white group-hover:text-[#C6963A] transition">
                    Guides &amp; Whitepapers
                  </div>
                  <div className="text-[11px] text-white/50">Enterprise migration blueprints</div>
                </div>
              </div>
              <span className="material-symbols-outlined text-[16px] text-white/70 group-hover:text-[#C6963A] group-hover:translate-x-1 transition-transform">
                chevron_right
              </span>
            </Link>

            <Link
              href="/resources"
              onClick={onClose}
              className="p-3 rounded-lg bg-white/[0.02] hover:bg-white/5 border border-white/5 hover:border-[#C6963A]/40 flex items-center justify-between group transition"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-[#071527] text-[#C6963A] border border-white/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[18px]">podcasts</span>
                </div>
                <div>
                  <div className="text-sm font-bold text-white group-hover:text-[#C6963A] transition">
                    Webinars &amp; Events
                  </div>
                  <div className="text-[11px] text-white/50">Live Q&amp;A with Principal Architects</div>
                </div>
              </div>
              <span className="material-symbols-outlined text-[16px] text-white/70 group-hover:text-[#C6963A] group-hover:translate-x-1 transition-transform">
                chevron_right
              </span>
            </Link>

            <Link
              href="/resources"
              onClick={onClose}
              className="p-3 rounded-lg bg-white/[0.02] hover:bg-white/5 border border-white/5 hover:border-[#C6963A]/40 flex items-center justify-between group transition"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-[#071527] text-[#C6963A] border border-white/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[18px]">query_stats</span>
                </div>
                <div>
                  <div className="text-sm font-bold text-white group-hover:text-[#C6963A] transition">
                    Benchmark Reports
                  </div>
                  <div className="text-[11px] text-white/50">2026 AI Engineering ROI Index</div>
                </div>
              </div>
              <span className="material-symbols-outlined text-[16px] text-white/70 group-hover:text-[#C6963A] group-hover:translate-x-1 transition-transform">
                chevron_right
              </span>
            </Link>
          </div>
        </div>

        {/* Right Column: 3 Article Spotlight Cards (8 cols) */}
        <div className="lg:col-span-8 p-7 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
            <span className="text-xs font-mono text-white/60 uppercase tracking-wider">
              Latest Architecture Publications
            </span>
            <Link
              href="/blog"
              onClick={onClose}
              className="text-xs font-bold text-[#C6963A] hover:underline flex items-center gap-1"
            >
              <span>View all insights</span>
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {ARTICLES.map((art) => (
              <Link
                key={art.title}
                href={art.href}
                onClick={onClose}
                className="p-4 rounded-xl bg-white/[0.02] border border-white/10 hover:border-[#C6963A]/60 transition flex flex-col justify-between group cursor-pointer"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-[10px] font-mono">
                    <span
                      className="px-2 py-0.5 rounded border"
                      style={{
                        backgroundColor: art.tagBg,
                        color: art.tagColor,
                        borderColor: `${art.tagColor}35`,
                      }}
                    >
                      {art.tag}
                    </span>
                    <span className="text-white/50">{art.readTime}</span>
                  </div>
                  <h4 className="font-bold text-sm text-white group-hover:text-[#C6963A] transition leading-snug">
                    {art.title}
                  </h4>
                  <p className="text-[11px] text-white/60 leading-relaxed">{art.excerpt}</p>
                </div>
                <div className="pt-3 text-[11px] text-[#C6963A] font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  <span>Read publication</span>
                  <span className="material-symbols-outlined text-[13px]">arrow_forward</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
