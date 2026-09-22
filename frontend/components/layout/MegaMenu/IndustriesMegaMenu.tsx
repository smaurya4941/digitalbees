import Link from 'next/link';
import { ArrowRight, Building, Shield, Flame, Cloud, ShoppingBag, Factory, Landmark, Radio, Truck, Network } from 'lucide-react';

interface Props {
  onClose: () => void;
}

const INDUSTRIES = [
  { title: 'Banking & Financial', slug: 'banking-financial-services', icon: Landmark },
  { title: 'Healthcare & Life Sciences', slug: 'healthcare-life-sciences', icon: Shield },
  { title: 'Energy & Utilities', slug: 'energy-utilities', icon: Flame },
  { title: 'SaaS & Technology', slug: 'saas-technology', icon: Cloud },
  { title: 'Retail & eCommerce', slug: 'retail-ecommerce', icon: ShoppingBag },
  { title: 'Manufacturing & Industrial', slug: 'manufacturing-industrial', icon: Factory },
  { title: 'Public Sector & Gov', slug: 'public-sector-government', icon: Building },
  { title: 'Telecom & Media', slug: 'telecom-media', icon: Radio },
  { title: 'Logistics & Supply Chain', slug: 'logistics-supply-chain', icon: Truck },
  { title: 'Global System Integrators', slug: 'global-system-integrators', icon: Network },
];

export function IndustriesMegaMenu({ onClose }: Props) {
  return (
    <div className="w-[470px] p-3 rounded-2xl bg-white/98 backdrop-blur-xl border border-[#CBDFF2] shadow-2xl text-[#0B1F3A]">
      {/* 2-Column Minimal List */}
      <div className="grid grid-cols-2 gap-1">
        {INDUSTRIES.map((ind) => {
          const Icon = ind.icon;
          return (
            <Link
              key={ind.slug}
              href={`/industries/${ind.slug}`}
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-[#F0F6FC] transition flex items-center gap-2.5 group border border-transparent hover:border-[#CBDFF2]"
            >
              <div className="w-6 h-6 rounded-lg bg-[#EAF2FB] text-[#0B1F3A] flex items-center justify-center shrink-0 group-hover:text-[#9E6D18] group-hover:bg-white transition-colors">
                <Icon className="h-3.5 w-3.5" />
              </div>
              <span className="text-xs font-semibold text-[#0B1F3A] group-hover:text-[#9E6D18] transition truncate">
                {ind.title}
              </span>
            </Link>
          );
        })}
      </div>

      {/* Footer bar */}
      <div className="mt-2 pt-2 border-t border-[#E2E8F0] flex items-center justify-between px-2">
        <span className="text-[11px] text-slate-400 font-mono">10 Regulated Verticals</span>
        <Link
          href="/industries"
          onClick={onClose}
          className="text-xs font-bold text-[#9E6D18] hover:text-[#0B1F3A] transition flex items-center gap-1"
        >
          <span>All Case Blueprints</span>
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
}
