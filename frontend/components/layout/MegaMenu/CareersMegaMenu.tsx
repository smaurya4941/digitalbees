import Link from 'next/link';

interface Props {
  onClose: () => void;
}

export function CareersMegaMenu({ onClose }: Props) {
  return (
    <div className="w-80 bg-[#0B1F3A]/98 backdrop-blur-xl border border-[#C6963A]/30 rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.6)] text-white overflow-hidden p-4 space-y-3">
      <div className="flex items-center justify-between pb-2 border-b border-white/10 text-xs">
        <span className="font-mono text-[#C6963A] uppercase tracking-wider text-[11px] font-semibold">
          // Careers at TeamBees
        </span>
        <span className="px-1.5 py-0.5 text-[9px] font-mono font-bold bg-emerald-500/20 text-emerald-300 rounded border border-emerald-500/30">
          We&apos;re Hiring
        </span>
      </div>

      <div className="space-y-1">
        <Link
          href="/careers"
          onClick={onClose}
          className="p-2.5 rounded-lg hover:bg-white/5 flex items-center justify-between group transition"
        >
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[18px] text-[#C6963A]">work</span>
            <span className="text-sm font-semibold text-white group-hover:text-[#C6963A] transition">
              Open Roles
            </span>
          </div>
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
            24 Openings
          </span>
        </Link>

        <Link
          href="/careers"
          onClick={onClose}
          className="p-2.5 rounded-lg hover:bg-white/5 flex items-center justify-between group transition"
        >
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[18px] text-[#C6963A]">diversity_3</span>
            <span className="text-sm font-semibold text-white group-hover:text-[#C6963A] transition">
              Life at TeamBees
            </span>
          </div>
          <span className="material-symbols-outlined text-[16px] text-white/40 group-hover:text-[#C6963A] transition">
            chevron_right
          </span>
        </Link>

        <Link
          href="/careers"
          onClick={onClose}
          className="p-2.5 rounded-lg hover:bg-white/5 flex items-center justify-between group transition"
        >
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[18px] text-[#C6963A]">school</span>
            <span className="text-sm font-semibold text-white group-hover:text-[#C6963A] transition">
              Candidate Resources
            </span>
          </div>
          <span className="material-symbols-outlined text-[16px] text-white/40 group-hover:text-[#C6963A] transition">
            chevron_right
          </span>
        </Link>

        <Link
          href="/company/esg"
          onClick={onClose}
          className="p-2.5 rounded-lg hover:bg-white/5 flex items-center justify-between group transition"
        >
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[18px] text-[#C6963A]">handshake</span>
            <span className="text-sm font-semibold text-white group-hover:text-[#C6963A] transition">
              Diversity &amp; Inclusion
            </span>
          </div>
          <span className="material-symbols-outlined text-[16px] text-white/40 group-hover:text-[#C6963A] transition">
            chevron_right
          </span>
        </Link>
      </div>

      <div className="pt-2 border-t border-white/10 text-center">
        <Link
          href="/careers"
          onClick={onClose}
          className="text-xs font-bold text-[#C6963A] hover:text-white flex items-center justify-center gap-1 transition"
        >
          <span>Explore Candidate Portal</span>
          <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
        </Link>
      </div>
    </div>
  );
}
