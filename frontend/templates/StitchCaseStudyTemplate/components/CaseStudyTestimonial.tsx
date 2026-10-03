import type { Testimonial } from '@/types/testimonial';

type CaseStudyTestimonialProps = {
  /** A published testimonial linked to this case study, or null. */
  testimonial: Testimonial | null;
};

/**
 * Client quote. Only ever a real testimonial the admin attached to this case
 * study (Testimonials → "Shown on" = case study) — never a generated quote.
 */
export function CaseStudyTestimonial({ testimonial }: CaseStudyTestimonialProps) {
  if (!testimonial) return null;

  const author = testimonial.author_name || testimonial.author_title;
  const role = [testimonial.author_name ? testimonial.author_title : null, testimonial.author_company]
    .filter(Boolean)
    .join(', ');

  return (
    <section className="py-16 bg-slate-100/80 border-b border-slate-200">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <figure className="bg-[#071324] text-white rounded-2xl p-8 sm:p-12 md:p-14 border border-white/10 shadow-2xl relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-64 h-64 bg-[#C6963A]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-4xl mx-auto text-center">
            <span className="material-symbols-outlined text-[#C6963A] text-[52px] leading-none mb-6 inline-block" aria-hidden>
              format_quote
            </span>
            <blockquote className="text-xl sm:text-2xl md:text-[28px] md:leading-[38px] font-medium text-white leading-relaxed mb-8">
              &ldquo;{testimonial.quote}&rdquo;
            </blockquote>
            {(author || role) && (
              <figcaption className="inline-flex flex-col items-center">
                {author && <span className="text-base sm:text-lg font-bold text-[#C6963A]">{author}</span>}
                {role && (
                  <span className="font-mono text-xs text-white/70 uppercase tracking-wider mt-1">{role}</span>
                )}
              </figcaption>
            )}
          </div>
        </figure>
      </div>
    </section>
  );
}
