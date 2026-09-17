import Link from "next/link";
import { getCaseStudies } from "@/lib/api/case-studies";

/**
 * Featured case study — Stitch spec Section 6. Dark navy card on navy bg
 * with gold metric headline and 2x2 stat grid.
 */
export default async function FeaturedCaseStudy() {
  const caseStudies = await getCaseStudies().catch(() => []);
  const featured = caseStudies[0];

  // Static fallback from the Stitch design (Divo case study)
  const fallbackStats = [
    { value: "99.9%", label: "Ledger Reconcile Accuracy" },
    { value: "14 Days", label: "Production Rollout" },
    { value: "6 Agents", label: "Autonomous Loop" },
    { value: "Zero", label: "Compliance Breaches" },
  ];

  return (
    <section
      className="py-16 md:py-24 bg-[#0B1F3A] text-white relative overflow-hidden"
      id="casestudies"
    >
      {/* Ambient glow */}
      <div className="absolute -right-40 -top-40 w-96 h-96 rounded-full bg-[#C6963A]/10 blur-3xl pointer-events-none" />
      <div className="max-w-[1280px] mx-auto px-4 md:px-16 relative z-10">
        <div className="p-8 md:p-12 rounded-xl bg-[#071527]/80 border border-[#C6963A]/30 backdrop-blur-md">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7">
              <span className="text-[12px] font-bold text-[#C6963A] tracking-wider uppercase block mb-3">
                {featured ? `CASE STUDY // ${featured.client_name ?? "CLIENT"}` : "CASE STUDY // MULTI-AGENT AI & CRM"}
              </span>
              <div className="text-[24px] leading-[32px] md:text-[32px] md:leading-[40px] font-extrabold text-[#C6963A] mb-4 tracking-tight">
                {featured?.metrics?.[0]
                  ? `${featured.metrics[0].value} ${featured.metrics[0].label}`
                  : "40% faster task execution, 45–60 minutes saved per user per day."}
              </div>
              <h3 className="text-[20px] leading-[28px] font-bold text-white mb-3">
                {featured?.title ?? "Autonomous Financial Intelligence & CRM Orchestration for Divo"}
              </h3>
              <p className="text-[16px] leading-[24px] text-white/80 mb-6">
                {featured?.summary ??
                  "TeamBees engineered and deployed an enterprise multi-agent workflow architecture connecting core ledger systems and CRM pipelines into a unified autonomous loop with human-in-the-loop validation."}
              </p>
              <Link
                href={featured?.href ?? "/case-studies"}
                className="inline-flex items-center gap-2 text-[#C6963A] hover:text-white text-[16px] font-bold transition-colors"
              >
                <span>Read the full story</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </Link>
            </div>
            <div className="lg:col-span-5 grid grid-cols-2 gap-4">
              {fallbackStats.map((stat) => (
                <div
                  key={stat.label}
                  className="p-5 rounded bg-[#0B1F3A]/70 border border-white/10"
                >
                  <span className="text-[32px] leading-[40px] font-bold text-[#C6963A] block">
                    {stat.value}
                  </span>
                  <span className="text-[12px] font-semibold text-white/70">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}