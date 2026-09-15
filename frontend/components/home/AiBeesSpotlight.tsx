import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/sections/SectionHeading';
import { Button } from '@/components/ui/Button';

export default function AiBeesSpotlight() {
  return (
    <Section tone="navy" space="lg" className="relative overflow-hidden">
      {/* Background pattern placeholder */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-brand-gold/20 via-transparent to-transparent"></div>
      
      <div className="relative z-10 grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
        <div>
          <SectionHeading
            title="AI that makes it into production."
            description="Most AI initiatives stall between prototype and production. AI Bees closes that gap — from use-case scoping and architecture through integration, guardrails, and monitoring — so what you ship is something your team can actually run and trust."
            as="h2"
            className="mb-8"
          />
          <Button href="/practices/ai-bees" variant="primary">
            Explore AI Bees
          </Button>
        </div>
        <div className="hidden lg:flex justify-end">
          <div className="aspect-square w-full max-w-md rounded-2xl bg-canvas/10 border border-white/10 p-8 flex items-center justify-center">
            {/* Visual placeholder matching the "abstract/data visuals" blueprint */}
            <div className="text-white/20">
              <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
