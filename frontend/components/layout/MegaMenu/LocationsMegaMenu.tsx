import Link from 'next/link';

interface RegionCard {
  name: string;
  slug: string;
  flag: string;
  badge: string;
  badgeColor: string;
  cities: string;
  description: string;
  complianceDoc: string;
  regime: string;
}

const REGIONS: RegionCard[] = [
  {
    name: 'United States',
    slug: 'usa',
    flag: '🇺🇸',
    badge: 'Americas',
    badgeColor: '#C6963A',
    cities: 'New York • San Francisco',
    description: 'Enterprise client relations, North American governance & executive search operations.',
    complianceDoc: 'W2 / C2C Protocols',
    regime: 'W2 / C2C',
  },
  {
    name: 'India',
    slug: 'india',
    flag: '🇮🇳',
    badge: 'Delivery Lab',
    badgeColor: '#10b981',
    cities: 'Bangalore • Noida',
    description: 'Primary engineering delivery center, dedicated AI pod training & automated QA facilities.',
    complianceDoc: 'ISO 27001 & SOC2',
    regime: 'ISO 27001',
  },
  {
    name: 'Singapore',
    slug: 'singapore',
    flag: '🇸🇬',
    badge: 'APAC HQ',
    badgeColor: '#3b82f6',
    cities: 'Marina Bay Financial Centre',
    description: 'APAC financial engineering node, cross-border fintech integrations & commodity trading.',
    complianceDoc: 'MAS Advisory',
    regime: 'MAS Regs',
  },
  {
    name: 'United Arab Emirates',
    slug: 'uae',
    flag: '🇦🇪',
    badge: 'MENA Hub',
    badgeColor: '#a855f7',
    cities: 'Dubai DIFC',
    description: 'Regional regulatory compliance, Emiratization advisory & public sector digital programs.',
    complianceDoc: 'DIFC Data Protection',
    regime: 'DIFC Data Law',
  },
  {
    name: 'United Kingdom',
    slug: 'uk',
    flag: '🇬🇧',
    badge: 'EMEA Hub',
    badgeColor: '#0ea5e9',
    cities: 'London • Canary Wharf',
    description: 'IR35 advisory, UK GDPR data privacy protocols & tier-1 investment banking pods.',
    complianceDoc: 'IR35 Safe Harbor',
    regime: 'IR35 Safe',
  },
  {
    name: 'Australia',
    slug: 'australia',
    flag: '🇦🇺',
    badge: 'ANZ Expansion',
    badgeColor: '#14b8a6',
    cities: 'Sydney CBD',
    description: 'Australian Privacy Principles, mining & clean energy technology initiatives.',
    complianceDoc: 'APRA Standards',
    regime: 'APRA CPS 234',
  },
];

interface Props {
  onClose: () => void;
}

export function LocationsMegaMenu({ onClose }: Props) {
  return (
    <div className="w-full bg-[#0B1F3A]/98 backdrop-blur-xl border-b border-[#C6963A]/30 shadow-[0_25px_60px_rgba(0,0,0,0.6)] text-white">
      {/* Header strip */}
      <div className="max-w-[1440px] mx-auto px-6 lg:px-8 py-3 bg-[#071527]/80 border-b border-white/10 flex items-center justify-between text-xs">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[#C6963A] font-semibold uppercase tracking-wider text-[11px]">
            // Global Delivery Grid
          </span>
          <span className="text-white/30 hidden sm:inline">|</span>
          <span className="text-white/70 hidden sm:inline">Local enough to matter, global enough to scale</span>
        </div>
        <span className="text-emerald-400 font-mono text-[11px] flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>24/7 Follow-the-Sun Engineering</span>
        </span>
      </div>

      {/* 6 Regional Cards */}
      <div className="max-w-[1440px] mx-auto px-6 lg:px-8 py-7 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {REGIONS.map((r) => (
          <div
            key={r.slug}
            className="p-4 rounded-xl bg-white/[0.03] border border-white/10 hover:border-[#C6963A] hover:bg-white/[0.06] transition flex flex-col justify-between group"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xl" role="img" aria-label={r.name}>
                  {r.flag}
                </span>
                <span
                  className="text-[10px] font-mono px-1.5 py-0.5 rounded border"
                  style={{
                    backgroundColor: `${r.badgeColor}18`,
                    color: r.badgeColor,
                    borderColor: `${r.badgeColor}35`,
                  }}
                >
                  {r.badge}
                </span>
              </div>
              <div>
                <Link
                  href={`/locations`}
                  onClick={onClose}
                  className="font-bold text-white text-sm group-hover:text-[#C6963A] transition block"
                >
                  {r.name}
                </Link>
                <div className="text-[11px] font-mono text-white/50">{r.cities}</div>
              </div>
              <p className="text-[11px] text-white/70 leading-relaxed pt-1">{r.description}</p>
            </div>

            <div className="pt-4 border-t border-white/10 mt-3 flex items-center justify-between text-[11px] font-mono">
              <Link
                href="/locations"
                onClick={onClose}
                className="text-[#C6963A] hover:underline flex items-center gap-0.5"
              >
                <span>Compliance</span>
                <span className="material-symbols-outlined text-[13px]">arrow_outward</span>
              </Link>
              <span className="text-white/40 text-[10px]">{r.regime}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Footer strip */}
      <div className="max-w-[1440px] mx-auto px-6 lg:px-8 py-3 bg-[#071527] border-t border-white/10 flex flex-wrap items-center justify-between text-xs gap-3">
        <div className="text-white/60 font-mono text-[11px]">
          Looking for multi-jurisdiction master service agreements?
        </div>
        <Link
          href="/contact-us"
          onClick={onClose}
          className="font-bold text-[#C6963A] hover:text-white transition flex items-center gap-1"
        >
          <span>Download Enterprise Global Compliance Whitepaper</span>
          <span className="material-symbols-outlined text-[15px]">download</span>
        </Link>
      </div>
    </div>
  );
}
