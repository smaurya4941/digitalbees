import Link from "next/link";

const perks = [
  { icon: "public",       label: "Global Mobility" },
  { icon: "school",       label: "Continuous Upskilling" },
  { icon: "rewarded_ads", label: "Tier-1 Equity & Comps" },
  { icon: "handshake",    label: "Tier-1 Enterprise Clients" },
];

/**
 * Careers spotlight — Stitch spec Section 12.
 * Split layout: image left, copy + perk grid right.
 */
export default function CareersSpotlight() {
  return (
    <section
      className="py-16 md:py-24 bg-[#FDFDFD] border-t border-[#e7e8ee]"
      id="careers"
    >
      <div className="max-w-[1280px] mx-auto px-4 md:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Image */}
          <div className="lg:col-span-6">
            <div className="rounded-xl overflow-hidden border border-[#c4c6ce]/40 shadow-xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://lh3.googleusercontent.com/aida/AEtjO1VWIjkRoSXUrPQdI9z-rrEX5qhEmu2wFizX7I8wv2nmEL5UNbJoEzYsQFfg_PCx3iR8LbkXh7kDMPyiZoY2NZfjjVfpUFVv7tsBi6uh3wvhswNDiLOpH6aOKtE-GaIlYabc3EQ1_ivxCEmFnE_Wniq9dlaTl6H0zGA9V9iKiqFwEta6Tn67Br2fvrUGPi0jq1ZNHA127c_nhRf8MePgXk_sGpWgiTfjBKNNIid7fmeaACn0F4q-AOM5fA"
                alt="TeamBees engineering and talent collaboration space"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-6">
            <span className="text-[12px] font-bold text-[#C6963A] tracking-wider uppercase mb-2 block">
              Cultivating Excellence
            </span>
            <h2 className="text-[24px] leading-[32px] md:text-[32px] md:leading-[40px] font-bold text-[#0B1F3A] mb-4">
              Join a team building what&apos;s next.
            </h2>
            <p className="text-[18px] leading-[28px] text-[#44474d] mb-5">
              TeamBees professionals work across banking, healthcare, energy, and SaaS clients on real, modern problems — from production AI agents to ServiceNow transformations — with the training and mobility to keep growing.
            </p>

            {/* Employee Testimonial Quote per Wireframe */}
            <div className="p-4 rounded-lg bg-[#f8f9ff] border-l-4 border-[#C6963A] mb-6">
              <p className="text-[14px] leading-[22px] italic text-[#0B1F3A]">
                &ldquo;I joined TeamBees to work on harder problems. Within six months I was on an LLM orchestration build for a top-tier bank — real production work, not a bench assignment.&rdquo;
              </p>
              <div className="mt-2 text-[12px] font-bold text-[#0B1F3A]">
                Priya Sharma &middot; <span className="text-[#44474d] font-normal">Senior AI Engineer, London Pod</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              {perks.map((perk) => (
                <div key={perk.label} className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#C6963A] text-[20px]">
                    {perk.icon}
                  </span>
                  <span className="text-[14px] font-semibold text-[#0B1F3A]">
                    {perk.label}
                  </span>
                </div>
              ))}
            </div>
            <Link
              href="/careers"
              className="inline-flex items-center gap-2 bg-[#0B1F3A] text-white px-6 py-3.5 rounded text-[15px] font-bold hover:bg-[#071527] transition-all duration-200"
            >
              <span>View Open Roles</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}