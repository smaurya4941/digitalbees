import Link from "next/link";

const personas = [
  {
    icon: "group_add",
    title: "I need to hire",
    description: "See how Talent Bees fills critical roles in days, not months, matching deep technical niche demands.",
    cta: "Explore Talent Bees",
    href: "/practices/talent-bees",
  },
  {
    icon: "terminal",
    title: "I need to build",
    description: "See how Digital, AI, Quality, ServiceNow, and Energy Bees deliver production work, not just headcount.",
    cta: "Explore Practices",
    href: "/practices",
  },
  {
    icon: "badge",
    title: "I'm a candidate",
    description: "See open roles and what it's actually like to work with global engineering leaders and top enterprises.",
    cta: "Explore Careers",
    href: "/careers",
  },
];

/**
 * Persona fork — fast-path routing cards matching Stitch spec Section 4.
 */
export default function PersonaFork() {
  return (
    <section className="py-12 md:py-16 bg-[#FDFDFD]">
      <div className="max-w-[1280px] mx-auto px-4 md:px-16">
        <div className="max-w-2xl mb-8 md:mb-10">
          <span className="text-[12px] font-bold text-[#C6963A] tracking-wider uppercase mb-2 block">
            Fast-Path Execution
          </span>
          <h2 className="text-[24px] leading-[32px] md:text-[32px] md:leading-[40px] font-bold text-[#0B1F3A]">
            Wherever you&apos;re starting from, there&apos;s a fast path to what you need.
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {personas.map((p) => (
            <div
              key={p.title}
              className="group p-8 rounded-lg bg-white border border-[#c4c6ce]/30 hover:border-[#C6963A]/50 transition-all duration-300 hover:shadow-lg flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-lg bg-[#eceef3] flex items-center justify-center text-[#0B1F3A] mb-6 group-hover:bg-[#C6963A] group-hover:text-[#0B1F3A] transition-colors">
                  <span className="material-symbols-outlined text-[24px]">{p.icon}</span>
                </div>
                <h3 className="text-[20px] leading-[28px] font-bold text-[#0B1F3A] mb-3">{p.title}</h3>
                <p className="text-[#44474d] text-[16px] leading-[24px] mb-6">{p.description}</p>
              </div>
              <Link
                href={p.href}
                className="inline-flex items-center gap-2 text-[16px] font-semibold text-[#C6963A] group-hover:translate-x-1 transition-transform"
              >
                <span>{p.cta}</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}