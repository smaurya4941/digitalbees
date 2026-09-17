import Link from "next/link";
import { getIndustries } from "@/lib/api/industries";
import { routes } from "@/config/routes";

const INDUSTRY_ICONS: Record<string, string> = {
  "banking-financial-services": "account_balance",
  "healthcare": "medical_services",
  "insurance": "verified_user",
  "retail-ecommerce": "shopping_cart",
  "manufacturing": "precision_manufacturing",
  "energy-utilities": "bolt",
  "technology-software": "memory",
  "public-sector": "apartment",
  "telecom": "cell_tower",
  "logistics-supply-chain": "local_shipping",
  "global-system-integrators": "handshake",
};

const FALLBACK_INDUSTRIES = [
  { slug: "banking-financial-services", name: "Banking & Financial Services", icon: "account_balance" },
  { slug: "healthcare", name: "Healthcare & Life Sciences", icon: "medical_services" },
  { slug: "energy-utilities", name: "Energy & Utilities", icon: "bolt" },
  { slug: "manufacturing", name: "Manufacturing & Industrial", icon: "precision_manufacturing" },
  { slug: "retail-ecommerce", name: "Retail & eCommerce", icon: "shopping_cart" },
  { slug: "technology-software", name: "SaaS & Technology", icon: "memory" },
  { slug: "insurance", name: "Insurance & Insurtech", icon: "verified_user" },
  { slug: "telecom", name: "Telecom & Media", icon: "cell_tower" },
  { slug: "logistics-supply-chain", name: "Logistics & Supply Chain", icon: "local_shipping" },
  { slug: "public-sector", name: "Public Sector & Government", icon: "apartment" },
];

/**
 * Industry strip — Section 7.
 * Horizontal scroll of industry cards with icons, live API data, and direct links.
 */
export default async function IndustryStrip() {
  const liveIndustries = await getIndustries().catch(() => []);
  const list = liveIndustries.length > 0
    ? liveIndustries.map((ind) => ({
        slug: ind.slug,
        name: ind.name,
        icon: INDUSTRY_ICONS[ind.slug] || "domain",
        href: ind.href || routes.industry(ind.slug),
      }))
    : FALLBACK_INDUSTRIES.map((ind) => ({
        slug: ind.slug,
        name: ind.name,
        icon: ind.icon,
        href: routes.industry(ind.slug),
      }));

  return (
    <section className="py-10 bg-[#f2f3f9] border-b border-[#e7e8ee]" id="industries">
      <div className="max-w-[1280px] mx-auto px-4 md:px-16">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#C6963A]" />
            <span className="text-[12px] font-bold text-[#44474d] tracking-wider uppercase">
              Enterprise Industry Footprint
            </span>
          </div>
          <Link
            href="/industries"
            className="text-[13px] font-semibold text-[#0B1F3A] hover:text-[#C6963A] transition-colors flex items-center gap-1 group"
          >
            <span>View All 10 Sectors</span>
            <span className="material-symbols-outlined text-[16px] group-hover:translate-x-0.5 transition-transform">
              arrow_forward
            </span>
          </Link>
        </div>

        {/* Horizontal scroll track */}
        <div className="relative">
          <div className="flex items-stretch gap-3.5 overflow-x-auto pb-3 pt-1 scroll-smooth snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {list.map((ind) => (
              <Link
                key={ind.slug}
                href={ind.href}
                className="snap-start shrink-0 min-w-[170px] md:min-w-[195px] max-w-[210px] flex flex-col items-center justify-center p-4 rounded-lg bg-white border border-[#c4c6ce]/30 hover:border-[#C6963A]/50 hover:shadow-md transition-all group text-center"
              >
                <div className="w-10 h-10 rounded-full bg-[#f8f9ff] group-hover:bg-[#C6963A]/15 flex items-center justify-center mb-2.5 transition-colors">
                  <span className="material-symbols-outlined text-[#C6963A] text-[22px] group-hover:scale-110 transition-transform">
                    {ind.icon}
                  </span>
                </div>
                <span className="text-[13px] font-bold text-[#0B1F3A] group-hover:text-[#C6963A] leading-snug transition-colors">
                  {ind.name}
                </span>
                <span className="text-[11px] font-semibold text-[#8a8d95] mt-1.5 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>Explore</span>
                  <span className="material-symbols-outlined text-[12px]">chevron_right</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}