import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import type { Cta } from '@/types/content';

type CTABandProps = {
  title?: string;
  description?: string;
  cta?: Cta;
};

export function CTABand({
  title = 'Let’s talk about what you’re building',
  description = 'Tell us the outcome you need. We’ll bring the talent and the technology to get there.',
  cta = { label: 'Start a conversation', url: '/contact' },
}: CTABandProps) {
  return (
    <section className="bg-brand-navy-deep text-ink-inverse">
      <Container>
        <div className="flex flex-col items-start gap-6 py-section-md md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl">
            <h2 className="text-h2">{title}</h2>
            <p className="mt-3 text-body-lg text-neutral-300">{description}</p>
          </div>
          <Button href={cta.url} variant="secondary" size="lg">
            {cta.label}
          </Button>
        </div>
      </Container>
    </section>
  );
}
