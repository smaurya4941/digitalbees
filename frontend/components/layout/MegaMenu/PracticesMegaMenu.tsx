import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { practiceColor, tint } from '@/lib/practices/visuals';
import { PracticeIcon } from '@/components/ui/PracticeIcon';
import type { PracticeSummary } from '@/types/practice';

interface Props {
  /** Live, published practices — managed in the admin, not hardcoded here. */
  practices: PracticeSummary[];
  onClose: () => void;
}

export function PracticesMegaMenu({ practices, onClose }: Props) {
  return (
    <div className="w-[490px] p-3.5 rounded-2xl bg-white/98 backdrop-blur-xl border border-[#CBDFF2] shadow-2xl text-[#0B1F3A]">
      {/* 2-column grid: every published practice + a 'View all' card */}
      <div className="grid grid-cols-2 gap-1.5">
        {practices.map((p) => {
          const color = practiceColor(p.color_token);
          return (
            <Link
              key={p.slug}
              href={p.href}
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-[#F0F6FC] transition flex items-center gap-2.5 group border border-transparent hover:border-[#CBDFF2]"
            >
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-transform group-hover:scale-105"
                style={{ backgroundColor: tint(color), color }}
              >
                <PracticeIcon name={p.icon} className="h-3.5 w-3.5" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="font-bold text-xs text-[#0B1F3A] group-hover:text-[#9E6D18] transition block truncate">
                  {p.name}
                </span>
                {p.tagline && (
                  <span className="text-[11px] text-slate-500 block truncate leading-tight">{p.tagline}</span>
                )}
              </div>
            </Link>
          );
        })}

        <Link
          href="/practices"
          onClick={onClose}
          className="p-2 rounded-xl bg-[#F0F6FC]/70 hover:bg-[#F0F6FC] transition flex items-center gap-2.5 group border border-dashed border-[#CBDFF2] hover:border-[#9E6D18]/50"
        >
          <div className="w-7 h-7 rounded-lg bg-[#9E6D18]/15 text-[#9E6D18] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <ArrowRight className="h-3.5 w-3.5" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="font-bold text-xs text-[#9E6D18] group-hover:text-[#0B1F3A] transition block truncate">
              {practices.length > 0 ? `View all ${practices.length} practices` : 'View all practices'}
            </span>
            <span className="text-[11px] text-slate-500 block truncate leading-tight">
              Compare pods &amp; specs →
            </span>
          </div>
        </Link>
      </div>
    </div>
  );
}
