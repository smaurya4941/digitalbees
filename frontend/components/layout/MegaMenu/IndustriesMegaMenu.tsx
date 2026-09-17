import Link from 'next/link';

interface IndustryTile {
  title: string;
  slug: string;
  icon: string;
  metric: string;
  metricIcon: string;
  description: string;
}

const INDUSTRIES: IndustryTile[] = [
  {
    title: 'Banking & Financial Services',
    slug: 'banking-financial-services',
    icon: 'account_balance',
    metric: '40% faster claims processing',
    metricIcon: 'trending_up',
    description: 'Core ledger sync, SOX compliance, algorithmic settlement.',
  },
  {
    title: 'Healthcare & Life Sciences',
    slug: 'healthcare-life-sciences',
    icon: 'health_and_safety',
    metric: '99.9% clinical data accuracy',
    metricIcon: 'check_circle',
    description: 'HIPAA compliant pipelines, synthetic clinical trial data.',
  },
  {
    title: 'Energy & Utilities',
    slug: 'energy-utilities',
    icon: 'electric_bolt',
    metric: 'Zero-latency CTRM pipelines',
    metricIcon: 'speed',
    description: 'Endur, Allegro, RightAngle and physical commodity risk.',
  },
  {
    title: 'SaaS & Technology',
    slug: 'saas-technology',
    icon: 'cloud_sync',
    metric: '3x faster feature velocity',
    metricIcon: 'rocket_launch',
    description: 'Dedicated full-stack engineering pods & multi-tenant scaling.',
  },
  {
    title: 'Retail & eCommerce',
    slug: 'retail-ecommerce',
    icon: 'shopping_cart',
    metric: '68% conversion lift in peaks',
    metricIcon: 'show_chart',
    description: 'Headless architecture, inventory streaming, search AI.',
  },
  {
    title: 'Manufacturing & Industrial',
    slug: 'manufacturing-industrial',
    icon: 'precision_manufacturing',
    metric: '45% downtime reduction',
    metricIcon: 'build',
    description: 'Predictive maintenance, IoT telemetry, ERP modernization.',
  },
  {
    title: 'Public Sector & Government',
    slug: 'public-sector-government',
    icon: 'policy',
    metric: 'FedRAMP & SOC2 certified',
    metricIcon: 'security',
    description: 'Air-gapped deployment, sovereign cloud data isolation.',
  },
  {
    title: 'Telecom & Media',
    slug: 'telecom-media',
    icon: 'cell_tower',
    metric: '50M+ subscriber data stream',
    metricIcon: 'stream',
    description: 'Real-time edge billing, 5G orchestration, low latency.',
  },
  {
    title: 'Logistics & Supply Chain',
    slug: 'logistics-supply-chain',
    icon: 'local_shipping',
    metric: 'Real-time fleet telemetry',
    metricIcon: 'route',
    description: 'Automated warehouse dispatch, customs compliance, ETA AI.',
  },
  {
    title: 'Global System Integrators',
    slug: 'global-system-integrators',
    icon: 'handshake',
    metric: 'Strategic Tier-1 channel partner',
    metricIcon: 'star',
    description: 'Subcontracting pods, white-label engineering delivery.',
  },
];

interface Props {
  onClose: () => void;
}

export function IndustriesMegaMenu({ onClose }: Props) {
  return (
    <div className="w-full bg-[#0B1F3A]/98 backdrop-blur-xl border-b border-[#C6963A]/30 shadow-[0_25px_60px_rgba(0,0,0,0.6)] text-white">
      {/* Header strip */}
      <div className="max-w-[1440px] mx-auto px-6 lg:px-8 py-3 bg-[#071527]/80 border-b border-white/10 flex items-center justify-between text-xs">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[#C6963A] font-semibold uppercase tracking-wider text-[11px]">
            // Enterprise Industry Footprint
          </span>
          <span className="text-white/30 hidden sm:inline">|</span>
          <span className="text-white/70 hidden sm:inline">
            Compliant domain engineering across highly-regulated verticals
          </span>
        </div>
        <span className="font-mono text-[11px] text-white/50">Click any sector to view case blueprints</span>
      </div>

      {/* 5x2 Structured Grid */}
      <div className="max-w-[1440px] mx-auto px-6 lg:px-8 py-7 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {INDUSTRIES.map((ind) => (
          <Link
            key={ind.slug}
            href={`/industries/${ind.slug}`}
            onClick={onClose}
            className="p-4 rounded-xl bg-white/[0.03] border border-white/10 hover:border-[#C6963A] hover:bg-white/[0.06] transition group cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-9 h-9 rounded-lg bg-[#071527] text-[#C6963A] border border-white/10 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:border-[#C6963A]/40 transition-transform">
                <span className="material-symbols-outlined text-[20px]">{ind.icon}</span>
              </div>
              <h4 className="font-bold text-[14px] text-white group-hover:text-[#C6963A] transition leading-snug">
                {ind.title}
              </h4>
              <div className="mt-2 text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">{ind.metricIcon}</span>
                <span className="truncate">{ind.metric}</span>
              </div>
              <p className="text-[11px] text-white/60 mt-1 line-clamp-2">{ind.description}</p>
            </div>
            <div className="pt-3 border-t border-white/5 mt-3 flex items-center gap-1 text-[11px] font-mono text-[#C6963A] opacity-0 group-hover:opacity-100 transition-opacity">
              <span>View blueprints</span>
              <span className="material-symbols-outlined text-[12px]">arrow_forward</span>
            </div>
          </Link>
        ))}
      </div>

      {/* Footer strip */}
      <div className="max-w-[1440px] mx-auto px-6 lg:px-8 py-3 bg-[#071527] border-t border-white/10 flex flex-wrap items-center justify-between text-xs gap-3">
        <div className="text-white/60">
          Need an enterprise MSA with custom governance protocols?
        </div>
        <Link
          href="/contact-us"
          onClick={onClose}
          className="font-bold text-[#C6963A] hover:text-white transition flex items-center gap-1"
        >
          <span>Schedule Industry Architecture Review</span>
          <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
        </Link>
      </div>
    </div>
  );
}
