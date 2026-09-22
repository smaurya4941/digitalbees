import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface Props {
  onClose: () => void;
}

const REGIONS = [
  { name: 'United States', flag: '🇺🇸', cities: 'New York · San Francisco', regime: 'W2 / C2C' },
  { name: 'India', flag: '🇮🇳', cities: 'Bangalore · Gurugram', regime: 'ISO 27001' },
  { name: 'Singapore', flag: '🇸🇬', cities: 'Marina Bay Financial Centre', regime: 'MAS Regs' },
  { name: 'United Arab Emirates', flag: '🇦🇪', cities: 'Dubai DIFC', regime: 'DIFC Law' },
  { name: 'United Kingdom', flag: '🇬🇧', cities: 'London · Canary Wharf', regime: 'IR35 Safe' },
  { name: 'Australia', flag: '🇦🇺', cities: 'Sydney CBD', regime: 'APRA CPS 234' },
];

export function LocationsMegaMenu({ onClose }: Props) {
  return (
    <div className="w-[330px] p-3 rounded-2xl bg-white/98 backdrop-blur-xl border border-[#CBDFF2] shadow-2xl text-[#0B1F3A]">
      {/* Region List */}
      <div className="space-y-0.5">
        {REGIONS.map((r) => (
          <Link
            key={r.name}
            href="/locations"
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-[#F0F6FC] transition flex items-center justify-between group border border-transparent hover:border-[#CBDFF2]"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="text-base">{r.flag}</span>
              <div className="min-w-0">
                <span className="font-bold text-xs text-[#0B1F3A] group-hover:text-[#9E6D18] transition block truncate">
                  {r.name}
                </span>
                <span className="text-[11px] text-slate-500 block truncate leading-tight">{r.cities}</span>
              </div>
            </div>
            <span className="text-[9.5px] font-mono text-slate-600 font-medium shrink-0 ml-2">{r.regime}</span>
          </Link>
        ))}
      </div>

      {/* Footer bar */}
      <div className="mt-2 pt-2 border-t border-[#E2E8F0] flex items-center justify-between px-1.5">
        <span className="text-[11px] text-slate-400 font-mono">24/7 Delivery</span>
        <Link
          href="/locations"
          onClick={onClose}
          className="text-xs font-bold text-[#9E6D18] hover:text-[#0B1F3A] transition flex items-center gap-1"
        >
          <span>All 6 Locations</span>
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
}
