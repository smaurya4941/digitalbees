import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import { routes } from '@/config/routes';

/** 404 body shared by the root and (website) not-found boundaries. */
export default function NotFoundContent() {
  return (
    <Section space="lg">
      <div className="flex max-w-xl flex-col gap-4">
        <span className="text-eyebrow uppercase text-ink-muted">Error 404</span>
        <h1 className="text-display-md text-ink">This page couldn’t be found</h1>
        <p className="text-body-lg text-ink-muted">
          The page may have moved or never existed. Try one of these instead.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Button href={routes.home()}>Go home</Button>
          <Button href={routes.practices()} variant="tertiary">
            Explore practices
          </Button>
          <Button href={routes.search()} variant="ghost">
            Search
          </Button>
        </div>
      </div>
    </Section>
  );
}
