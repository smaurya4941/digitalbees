import { getTestimonials } from "@/lib/api/testimonials";

/**
 * Testimonial section — Section 10.
 * Large-format client quote with author name, title, company, region, and logo marquee.
 */
const clients = [
  "Stryker", "BT", "Tata", "Vocera", "QuestLabs",
  "WillWare", "Ananta Systems", "Menhood", "Resmera Solutions", "Squire Technologies",
];

export default async function TestimonialSection() {
  const testimonials = await getTestimonials().catch(() => []);
  // Use first client testimonial
  const featured = testimonials[0] ?? null;

  const quote =
    featured?.quote ??
    "TeamBees provided not just the niche technical talent we needed within days, but the architectural leadership to ensure our production systems scaled securely from day one.";
  const authorName = featured?.author_name || "Marcus Vance";
  const authorTitle = featured?.author_title || "VP of Engineering & Architecture";
  const authorCompany = featured?.author_company || "Global Financial Services Corp";
  const authorRegion = featured?.author_location || "New York, USA";

  return (
    <section className="py-16 md:py-24 bg-[#FDFDFD] border-b border-[#e7e8ee]" id="testimonials">
      <div className="max-w-[1280px] mx-auto px-4 md:px-16">
        {/* Testimonial quote */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <span
            className="material-symbols-outlined text-[#C6963A] text-[48px] mb-4 block mx-auto"
            style={{ fontVariationSettings: '"FILL" 1' }}
          >
            format_quote
          </span>
          <blockquote className="text-[20px] leading-[28px] md:text-[32px] md:leading-[40px] font-medium text-[#0B1F3A] italic mb-6">
            &ldquo;{quote}&rdquo;
          </blockquote>

          {/* Full attribution: name / title / company / region */}
          <div className="flex flex-col items-center">
            <div className="text-[18px] font-bold text-[#0B1F3A]">
              {authorName}
            </div>
            <div className="text-[14px] font-semibold text-[#44474d] tracking-wide mt-0.5">
              {authorTitle} &middot; <span className="text-[#0B1F3A]">{authorCompany}</span>
            </div>
            <div className="inline-flex items-center gap-1.5 text-[12px] font-mono text-[#C6963A] uppercase tracking-wider mt-1">
              <span className="material-symbols-outlined text-[14px]">location_on</span>
              <span>{authorRegion}</span>
            </div>
          </div>
        </div>

        {/* Logo wall */}
        <div className="border-t border-[#e7e8ee] pt-12">
          <span className="text-[12px] font-bold text-center text-[#44474d]/80 uppercase tracking-widest block mb-8">
            Trusted by Engineering Leaders at
          </span>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 opacity-70">
            {clients.map((client) => (
              <span
                key={client}
                className="text-[20px] font-bold tracking-tight text-[#0B1F3A]/80 hover:text-[#C6963A] transition-colors"
              >
                {client}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}