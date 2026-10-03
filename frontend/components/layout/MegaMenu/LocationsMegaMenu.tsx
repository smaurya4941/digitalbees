import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { routes } from '@/config/routes';
import { flagEmoji } from '@/lib/utils/flag';
import type { LocationSummary } from '@/types/location';

interface Props {
  onClose: () => void;
  /** Published offices (admin-managed `Location` records). */
  offices: LocationSummary[];
}

export function LocationsMegaMenu({ onClose, offices }: Props) {
  return (
    <div className="w-[330px] p-3 rounded-2xl bg-white/98 backdrop-blur-xl border border-[#CBDFF2] shadow-2xl text-[#0B1F3A]">
      {/* Office List */}
      <div className="space-y-0.5">
        {offices.map((office) => (
          <Link
            key={office.slug}
            href={office.href}
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-[#F0F6FC] transition flex items-center justify-between group border border-transparent hover:border-[#CBDFF2]"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="text-base" aria-hidden>
                {flagEmoji(office.region_code)}
              </span>
              <div className="min-w-0">
                <span className="font-bold text-xs text-[#0B1F3A] group-hover:text-[#9E6D18] transition block truncate">
                  {[office.city ?? office.name, office.country].filter(Boolean).join(', ')}
                </span>
                {office.address && (
                  <span className="text-[11px] text-slate-500 block truncate leading-tight">{office.address}</span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Footer bar */}
      <div className="mt-2 pt-2 border-t border-[#E2E8F0] flex items-center justify-between px-1.5">
        <span className="text-[11px] text-slate-400 font-mono">24/7 Delivery</span>
        <Link
          href={routes.locations()}
          onClick={onClose}
          className="text-xs font-bold text-[#9E6D18] hover:text-[#0B1F3A] transition flex items-center gap-1"
        >
          <span>All Locations</span>
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
}
