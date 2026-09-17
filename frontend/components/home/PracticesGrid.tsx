import Link from "next/link";
import { getPractices } from "@/lib/api/practices";

const PRACTICE_META: Record<
  string,
  { icon: string; color: string; bgColor: string; tag: string; tagColor: string }
> = {
  "talent-bees":    { icon: "group",           color: "#4a6fa1", bgColor: "#4a6fa1/10", tag: "STAFFING & TALENT",     tagColor: "#4a6fa1" },
  "digital-bees":   { icon: "dataset",         color: "#3f8fa5", bgColor: "#3f8fa5/10", tag: "DATA & DIGITAL",        tagColor: "#3f8fa5" },
  "ai-bees":        { icon: "smart_toy",       color: "#6b4fa1", bgColor: "#6b4fa1/10", tag: "AI & AUTOMATION",       tagColor: "#6b4fa1" },
  "marketing-bees": { icon: "campaign",        color: "#b8862b", bgColor: "#b8862b/10", tag: "GROWTH MARKETING",      tagColor: "#b8862b" },
  "quality-bees":   { icon: "verified",        color: "#4a8f6b", bgColor: "#4a8f6b/10", tag: "QA & TESTING",          tagColor: "#4a8f6b" },
  "servicenow-bees":{ icon: "settings_suggest",color: "#2e6b4f", bgColor: "#2e6b4f/10", tag: "ENTERPRISE SUITE",     tagColor: "#2e6b4f" },
  "energy-bees":    { icon: "bolt",            color: "#8a5a2e", bgColor: "#8a5a2e/10", tag: "COMMODITIES & TRADING", tagColor: "#8a5a2e" },
};

const FALLBACK_META = { icon: "hub", color: "#C6963A", bgColor: "#C6963A/10", tag: "PRACTICE", tagColor: "#C6963A" };

/**
 * Practices grid — 7-practice card grid matching Stitch spec Section 5.
 * Data-driven via API; falls back gracefully when backend is unreachable.
 */
export default async function PracticesGrid() {
  const practices = await getPractices().catch(() => []);

  if (practices.length === 0) return null;

  return (
    <section className="py-16 md:py-24 bg-white border-b border-[#e7e8ee]" id="practices">
      <div className="max-w-[1280px] mx-auto px-4 md:px-16">
        {/* Section header */}
        <div className="max-w-2xl mb-12">
          <span className="text-[12px] font-bold text-[#C6963A] tracking-wider uppercase mb-2 block">
            Seven Specialist Practices
          </span>
          <h2 className="text-[24px] leading-[32px] md:text-[32px] md:leading-[40px] font-bold text-[#0B1F3A]">
            Seven practices. One accountable partner.
          </h2>
          <p className="text-[#44474d] text-[16px] leading-[26px] mt-3">
            Most partners make you choose: a staffing firm that stops at the resume, or a delivery shop that stops at the project. TeamBees does both, under one roof.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {practices.map((practice, idx) => {
            const meta = PRACTICE_META[practice.slug] ?? FALLBACK_META;
            const isWide = idx === practices.length - 1 && practices.length % 3 !== 0;

            return (
              <Link
                key={practice.id}
                href={practice.href}
                className={`group p-6 rounded-lg bg-white border border-[#c4c6ce]/30 hover:border-[#C6963A]/40 transition-all duration-200 flex flex-col justify-between hover:shadow-md ${isWide ? "md:col-span-2 lg:col-span-3" : ""}`}
              >
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span
                      className="w-9 h-9 rounded flex items-center justify-center"
                      style={{ backgroundColor: `${meta.color}18` }}
                    >
                      <span
                        className="material-symbols-outlined text-[20px]"
                        style={{ color: meta.color }}
                      >
                        {meta.icon}
                      </span>
                    </span>
                    <h3 className="text-[20px] leading-[28px] font-bold text-[#0B1F3A]">
                      {practice.name}
                    </h3>
                    <span
                      className="ml-auto px-2 py-0.5 rounded text-[11px] font-bold uppercase"
                      style={{ color: meta.tagColor, backgroundColor: `${meta.tagColor}18` }}
                    >
                      {meta.tag}
                    </span>
                  </div>
                  {practice.tagline && (
                    <p className="text-[#44474d] text-[14px] leading-[20px] mb-4">{practice.tagline}</p>
                  )}
                  {!practice.tagline && practice.summary && (
                    <p className="text-[#44474d] text-[14px] leading-[20px] mb-4">{practice.summary}</p>
                  )}
                </div>
                <div className="pt-4 border-t border-[#e7e8ee] flex items-center gap-2 text-[12px] font-semibold" style={{ color: meta.tagColor }}>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  Explore {practice.name}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}