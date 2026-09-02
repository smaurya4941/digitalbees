import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils/cn';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import type { Hero as HeroContent } from '@/types/content';

const hero = cva('', {
  variants: {
    tone: {
      canvas: 'bg-canvas text-ink',
      sunken: 'bg-canvas-sunken text-ink',
      navy: 'bg-brand-navy-deep text-ink-inverse',
    },
  },
  defaultVariants: { tone: 'canvas' },
});

type HeroProps = VariantProps<typeof hero> & {
  content: HeroContent;
  className?: string;
};

/**
 * Page hero. One component, tone variants — used by every template so 300+
 * pages share a hero without 300 hero implementations.
 */
export function Hero({ content, tone, className }: HeroProps) {
  const onDark = tone === 'navy';

  return (
    <section className={cn(hero({ tone }), 'py-section-md', className)}>
      <Container>
        <div className="flex max-w-3xl flex-col gap-6">
          <span
            className={cn(
              'text-eyebrow uppercase',
              onDark ? 'text-brand-gold-muted' : 'text-brand-gold-muted',
            )}
          >
            {content.eyebrow}
          </span>
          <h1 className="text-headline-lg-mobile md:text-display-md">{content.title}</h1>
          {content.description && (
            <p
              className={cn(
                'text-body-lg',
                onDark ? 'text-neutral-300' : 'text-ink-muted',
              )}
            >
              {content.description}
            </p>
          )}
          <div className="mt-2 flex flex-wrap gap-3">
            <Button href={content.cta.url} variant={onDark ? 'secondary' : 'primary'}>
              {content.cta.label}
            </Button>
            {content.secondary_cta && (
              <Button
                href={content.secondary_cta.url}
                variant={onDark ? 'ghost' : 'tertiary'}
              >
                {content.secondary_cta.label}
              </Button>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
