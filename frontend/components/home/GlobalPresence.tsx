import Link from "next/link";
import { getRegions } from "@/lib/api/regions";
import { routes } from "@/config/routes";

const REGION_META: Record<
  string,
  { icon: string; city: string; tag: string; compliance: string; description: string }
> = {
  india: {
    icon: "hub",
    city: "India (Bangalore & Hyderabad Delivery Hubs)",
    tag: "OFFSHORE DELIVERY CENTRE",
    compliance: "ISO 27001, SOC2 Type II, 24x7 Follow-The-Sun Delivery",
    description: "Core offshore engineering centers, enterprise QA automation pods, and high-velocity talent delivery at scale.",
  },
  usa: {
    icon: "location_on",
    city: "United States (Austin & New York)",
    tag: "NORTH AMERICA HQ",
    compliance: "SOC2 Type II, FINRA & HIPAA Compliant Delivery",
    description: "Enterprise client engagement, executive delivery leadership, and high-throughput financial architectures.",
  },
  singapore: {
    icon: "account_balance",
    city: "Singapore (APAC Operations)",
    tag: "APAC REGIONAL HUB",
    compliance: "MAS Technology Risk Management & Regional Banking Gateway",
    description: "Asia-Pacific client coordination, commodity trading desk support, and fintech platform operations.",
  },
  uae: {
    icon: "location_city",
    city: "UAE (Dubai Hub)",
    tag: "MIDDLE EAST HUB",
    compliance: "DIFC / ADGM Data Compliance & Regional Advisory",
    description: "Regional regulatory compliance, public sector digital programs, and sovereign cloud architectures.",
  },
  uk: {
    icon: "apartment",
    city: "United Kingdom (London)",
    tag: "EUROPEAN OPERATIONS",
    compliance: "FCA & UK-GDPR Regulated Financial Architecture",
    description: "Capital markets engineering node, Tier-1 banking pod leadership, and cross-border digital transformation.",
  },
  europe: {
    icon: "public",
    city: "Europe (Poland Delivery Hub)",
    tag: "EU DELIVERY CENTRE",
    compliance: "EU AI Act & Data Sovereignty Delivery Pods",
    description: "Nearshore engineering, specialized cloud infrastructure, and distributed QA automation centers.",
  },
  canada: {
    icon: "domain",
    city: "Canada (Toronto)",
    tag: "ENTERPRISE TECH NODE",
    compliance: "PIPEDA Enterprise Cloud & Multi-Region Resiliency",
    description: "Enterprise SaaS modernization, data warehousing, and bilingual technology staffing solutions.",
  },
  australia: {
    icon: "travel_explore",
    city: "Australia (Sydney)",
    tag: "ANZ REGIONAL NODE",
    compliance: "APRA CPS 234 Cybersecurity & Cloud Operations",
    description: "Cloud engineering, commodity trading integrations, and 24x7 follow-the-sun managed platform operations.",
  },
};

const DEFAULT_SLUGS = ["india", "usa", "singapore", "uae", "uk", "europe", "canada", "australia"];

interface GlobalPresenceProps {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  limit?: number;
}

/**
 * Global presence — Section 9.
 * 8-market card grid highlighting the 4 core delivery hubs (India ODC, USA, Singapore, UAE)
 * alongside European, Canadian, and ANZ regional engineering nodes.
 */
export default async function GlobalPresence({
  eyebrow = "GLOBAL FOOTPRINT \u00B7 OFFSHORE TO NEARSHORE",
  title = "Distributed delivery hubs across global enterprise markets.",
  subtitle,
  limit = 8,
}: GlobalPresenceProps = {}) {
  const liveRegions = await getRegions().catch(() => []);
  const slugs = liveRegions.length > 0 ? liveRegions.map((r) => r.slug) : DEFAULT_SLUGS;

  // Make sure DEFAULT_SLUGS order is preserved and all exist
  const sortedSlugs = Array.from(new Set([...DEFAULT_SLUGS, ...slugs]));

  const displayRegions = sortedSlugs
    .map((slug) => ({
      slug,
      name:
        liveRegions.find((r) => r.slug === slug)?.name ||
        slug.toUpperCase().replace('USA', 'USA').replace('UK', 'UK').replace('UAE', 'UAE'),
      href: routes.region(slug),
      meta: REGION_META[slug] || {
        icon: "public",
        city: slug.toUpperCase(),
        tag: "DELIVERY NODE",
        compliance: "SOC2 & ISO 27001 Aligned",
        description: "Specialized engineering and delivery leadership.",
      },
    }))
    .slice(0, limit);

  return (
    <section className="py-16 md:py-24 bg-white border-b border-[#e7e8ee]" id="locations">
      <div className="max-w-[1280px] mx-auto px-4 md:px-16">
        {/* Header with Locations Hub link */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div className="max-w-2xl">
            <span className="text-[12px] font-bold text-[#C6963A] tracking-wider uppercase mb-2 block">
              {eyebrow}
            </span>
            <h2 className="text-[24px] leading-[32px] md:text-[32px] md:leading-[40px] font-bold text-[#0B1F3A]">
              {title}
            </h2>
            {subtitle && (
              <p className="mt-2 text-[15px] text-[#44474d] leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>
          <Link
            href="/locations"
            className="mt-4 md:mt-0 inline-flex items-center gap-1.5 text-[14px] font-bold text-[#0B1F3A] hover:text-[#C6963A] transition-colors shrink-0 group"
          >
            <span>Explore All Global Locations</span>
            <span className="material-symbols-outlined text-[18px] group-hover:translate-x-0.5 transition-transform">
              arrow_forward
            </span>
          </Link>
        </div>

        {/* 8-region card grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayRegions.map((region) => (
            <Link
              key={region.slug}
              href={region.href}
              className="p-6 rounded-lg bg-white border border-[#c4c6ce]/30 hover:border-[#C6963A]/50 hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#C6963A] text-[24px]">
                      {region.meta.icon}
                    </span>
                    <h3 className="text-[18px] leading-[26px] font-bold text-[#0B1F3A] group-hover:text-[#C6963A] transition-colors">
                      {region.name}
                    </h3>
                  </div>
                  <span className="text-[10px] font-bold text-[#C6963A] bg-[#C6963A]/10 px-2 py-0.5 rounded tracking-wide">
                    {region.meta.tag}
                  </span>
                </div>

                <div className="text-[12px] font-semibold text-[#0B1F3A]/70 mb-2">
                  {region.meta.city}
                </div>

                <p className="text-[#44474d] text-[14px] leading-[20px] mb-4">
                  {region.meta.description}
                </p>
              </div>

              <div className="pt-3 border-t border-[#e7e8ee]">
                <div className="text-[11px] font-mono text-[#C6963A] flex items-center gap-1 mb-2">
                  <span className="material-symbols-outlined text-[14px]">shield</span>
                  <span>{region.meta.compliance}</span>
                </div>
                <div className="flex items-center gap-1 text-[12px] font-bold text-[#0B1F3A] group-hover:text-[#C6963A] transition-colors">
                  <span>Explore {region.name} Pods</span>
                  <span className="material-symbols-outlined text-[14px] group-hover:translate-x-1 transition-transform">
                    arrow_forward
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}