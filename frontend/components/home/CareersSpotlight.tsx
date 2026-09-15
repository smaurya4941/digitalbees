import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/sections/SectionHeading';
import { Button } from '@/components/ui/Button';
import { getTestimonials } from '@/lib/api/testimonials';

export default async function CareersSpotlight() {
  const testimonials = await getTestimonials('careers');
  const testimonial = testimonials[0];

  return (
    <Section tone="sunken" space="lg">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
        <div className="order-2 lg:order-1 relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-canvas shadow-sm">
          {/* Real employee photo placeholder per blueprint §15.3 */}
          <div className="absolute inset-0 bg-neutral-200 flex flex-col justify-end p-8">
            {testimonial && (
              <div className="bg-white/90 backdrop-blur p-6 rounded-xl border border-white/20">
                <blockquote className="text-body-lg font-medium text-brand-navy mb-4">
                  &quot;{testimonial.quote}&quot;
                </blockquote>
                {(testimonial.author_name || testimonial.author_title) && (
                  <>
                    {testimonial.author_name && (
                      <div className="text-body-sm font-bold text-ink">{testimonial.author_name}</div>
                    )}
                    <div className="text-body-sm text-ink-muted">
                      {[testimonial.author_title, testimonial.author_company].filter(Boolean).join(', ')}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="order-1 lg:order-2">
          <SectionHeading
            title="Join a team building what's next."
            description="TeamBees professionals work across banking, healthcare, energy, and SaaS clients on real, modern problems — from production AI agents to ServiceNow transformations — with the training and mobility to keep growing into them."
            as="h2"
            className="mb-8"
          />
          <Button href="/careers" variant="primary">
            View Open Roles
          </Button>
        </div>
      </div>
    </Section>
  );
}
