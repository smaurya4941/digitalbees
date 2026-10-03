import Link from 'next/link';
import {
  Activity,
  ArrowRight,
  Building2,
  Cloud,
  Factory,
  Flame,
  HeartPulse,
  Landmark,
  Network,
  Radio,
  Shield,
  ShoppingBag,
  Truck,
  type LucideIcon,
} from 'lucide-react';
import { PRACTICE_ICONS } from '@/lib/practices/visuals';
import type { IndustrySummary } from '@/types/industry';

interface Props {
  /** Live, published industries (admin-managed). */
  industries: IndustrySummary[];
  onClose: () => void;
}

// Industry icons are free-text in the admin; map the common names and fall
// back to the practice icon set, then a neutral building.
const INDUSTRY_ICONS: Record<string, LucideIcon> = {
  activity: Activity,
  'heart-pulse': HeartPulse,
  landmark: Landmark,
  shield: Shield,
  flame: Flame,
  cloud: Cloud,
  'shopping-bag': ShoppingBag,
  factory: Factory,
  building: Building2,
  'building-2': Building2,
  radio: Radio,
  truck: Truck,
  network: Network,
};

export function industryIcon(name: string | null | undefined): LucideIcon {
  return (name && (INDUSTRY_ICONS[name] ?? PRACTICE_ICONS[name])) || Building2;
}

export function IndustriesMegaMenu({ industries, onClose }: Props) {
  return (
    <div className="w-[470px] p-3 rounded-2xl bg-white/98 backdrop-blur-xl border border-[#CBDFF2] shadow-2xl text-[#0B1F3A]">
      {/* 2-Column Minimal List */}
      <div className="grid grid-cols-2 gap-1">
        {industries.map((ind) => {
          const Icon = industryIcon(ind.icon);
          return (
            <Link
              key={ind.slug}
              href={ind.href}
              onClick={onClose}
              title={ind.name}
              className="p-2 rounded-xl hover:bg-[#F0F6FC] transition flex items-center gap-2.5 group border border-transparent hover:border-[#CBDFF2]"
            >
              <div className="w-6 h-6 rounded-lg bg-[#EAF2FB] text-[#0B1F3A] flex items-center justify-center shrink-0 group-hover:text-[#9E6D18] group-hover:bg-white transition-colors">
                <Icon className="h-3.5 w-3.5" />
              </div>
              <span className="text-xs font-semibold text-[#0B1F3A] group-hover:text-[#9E6D18] transition truncate">
                {ind.name}
              </span>
            </Link>
          );
        })}
      </div>

      {/* Footer bar */}
      <div className="mt-2 pt-2 border-t border-[#E2E8F0] flex items-center justify-between px-2">
        <span className="text-[11px] text-slate-400 font-mono">
          {industries.length} Regulated {industries.length === 1 ? 'Vertical' : 'Verticals'}
        </span>
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
