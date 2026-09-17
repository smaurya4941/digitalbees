import Link from "next/link";
import { getInsights } from "@/lib/api/resources";

interface StaticInsight {
  tag: string;
  tagColor: string;
  tagBg: string;
  readTime: string;
  title: string;
  href: string;
  summary: string;
}

const STATIC_INSIGHTS: StaticInsight[] = [
  {
    tag: "AI & AUTOMATION",
    tagColor: "#6B4FA1",
    tagBg: "#6B4FA1",
    readTime: "5 min read",
    title: "Deploying Multi-Agent Systems in Regulated Financial Environments",
    href: "/insights",
    summary: "Technical patterns for ledger state verification, consensus protocols, and auditability in live trading environments.",
  },
  {
    tag: "ENTERPRISE SERVICENOW",
    tagColor: "#2E6B4F",
    tagBg: "#2E6B4F",
    readTime: "7 min read",
    title: "Moving 70%+ Custom Fields to OOTB: A CMDB Overhaul Case Study",
    href: "/insights",
    summary: "How enterprise architects pruned 8 years of technical debt and restored native ServiceNow Washington release agility.",
  },
  {
    tag: "WORKFORCE STRATEGY",
    tagColor: "#0B1F3A",
    tagBg: "#0B1F3A",
    readTime: "4 min read",
    title: "Why the Best Enterprise Engineering Teams Combine Headcount with Delivery Capability",
    href: "/insights",
    summary: "The strategic difference between pure staff-aug and accountable technical pods in modern software delivery.",
  },
];

/**
 * Insights preview — Stitch spec Section 11.
 * 3-col article cards with practice-color category tags.
 */
export default async function InsightsPreview() {
  const { items } = await getInsights(3).catch(() => ({ items: [] as Awaited<ReturnType<typeof getInsights>>["items"] }));

  const hasLive = items.length > 0;

  return (
    <section className="py-16 md:py-24 bg-[#f8f9ff]" id="insights">
      <div className="max-w-[1280px] mx-auto px-4 md:px-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-[12px] font-bold text-[#C6963A] tracking-wider uppercase mb-2 block">
              Direct from the Engineering Floor
            </span>
            <h2 className="text-[24px] leading-[32px] md:text-[32px] md:leading-[40px] font-bold text-[#0B1F3A]">
              Latest Engineering &amp; Workforce Insights
            </h2>
          </div>
          <Link
            href="/insights"
            className="inline-flex items-center gap-1.5 text-[#0B1F3A] text-[15px] font-bold hover:text-[#C6963A] transition-colors mt-4 md:mt-0"
          >
            <span>View All Insights</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {STATIC_INSIGHTS.map((insight, i) => {
            const liveItem = hasLive ? items[i] : null;
            return (
              <article
                key={insight.title}
                className="p-6 rounded-lg bg-white border border-[#c4c6ce]/30 hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className="text-[12px] font-bold px-2 py-0.5 rounded uppercase"
                      style={{ color: insight.tagColor, backgroundColor: `${insight.tagBg}15` }}
                    >
                      {insight.tag}
                    </span>
                    <span className="text-[12px] font-semibold text-[#44474d]">
                      {insight.readTime}
                    </span>
                  </div>
                  <h3 className="text-[20px] leading-[28px] font-bold text-[#0B1F3A] mb-3 hover:text-[#C6963A] transition-colors">
                    <Link href={liveItem?.href ?? insight.href}>
                      {liveItem?.title ?? insight.title}
                    </Link>
                  </h3>
                  <p className="text-[#44474d] text-[16px] leading-[24px] mb-6">
                    {liveItem?.excerpt ?? insight.summary}
                  </p>
                </div>
                <Link
                  href={liveItem?.href ?? insight.href}
                  className="inline-flex items-center gap-1 text-[#C6963A] font-semibold text-[14px]"
                >
                  <span>Read analysis</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </Link>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}