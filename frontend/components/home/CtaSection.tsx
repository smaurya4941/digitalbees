import { CTABand } from '@/components/sections/CTABand';
import { routes } from '@/config/routes';

export default function CtaSection() {
  return (
    <CTABand
      title="Let's build your team."
      description="Tell us what you're trying to solve — we'll tell you honestly whether we're the right fit."
      cta={{
        label: "Book a Consultation",
        url: routes.contact(),
      }}
    />
  );
}
