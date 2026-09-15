import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { getTestimonials } from '@/lib/api/testimonials';

export default async function TestimonialSection() {
  const testimonials = await getTestimonials('home');
  const testimonial = testimonials[0];

  if (!testimonial) return null;

  const roleLine = [testimonial.author_title, testimonial.author_company].filter(Boolean).join(', ');

  return (
    <Section space="lg" tone="sunken">
      <Container width="standard">
        <figure className="mx-auto max-w-4xl text-center">
          <blockquote className="text-h3 md:text-h2 text-brand-navy leading-relaxed font-medium">
            &quot;{testimonial.quote}&quot;
          </blockquote>
          {(testimonial.author_name || roleLine) && (
            <figcaption className="mt-8 flex flex-col items-center gap-1">
              {testimonial.author_name && <div className="text-body-lg font-bold text-ink">{testimonial.author_name}</div>}
              {roleLine && <div className="text-body-md text-ink-muted">{roleLine}</div>}
            </figcaption>
          )}
        </figure>
      </Container>
    </Section>
  );
}
