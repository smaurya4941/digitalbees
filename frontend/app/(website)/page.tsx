import ReniusHero from '@/components/home/renius/ReniusHero';
import ReniusPersonaFork from '@/components/home/renius/ReniusPersonaFork';
import ReniusPracticesCarousel from '@/components/home/renius/ReniusPracticesCarousel';
import ReniusIndustryStrip from '@/components/home/renius/ReniusIndustryStrip';
import ReniusWhoWeAre from '@/components/home/renius/ReniusWhoWeAre';
import ReniusProofValidation from '@/components/home/renius/ReniusProofValidation';
import ReniusCaseStudySlider from '@/components/home/renius/ReniusCaseStudySlider';
import ReniusCapabilitiesGrid from '@/components/home/renius/ReniusCapabilitiesGrid';
import ReniusCtaBand from '@/components/home/renius/ReniusCtaBand';
import ReniusMilestonesStrip from '@/components/home/renius/ReniusMilestonesStrip';
import ReniusTrustStrip from '@/components/home/renius/ReniusTrustStrip';
import ReniusWhyChooseUs from '@/components/home/renius/ReniusWhyChooseUs';
import ReniusClientMarquee from '@/components/home/renius/ReniusClientMarquee';
import ReniusInsightsPreview from '@/components/home/renius/ReniusInsightsPreview';
import { getPractices } from '@/lib/api/practices';
import { getIndustries } from '@/lib/api/industries';

export const metadata = {
  title: 'TeamBees — Global Talent & Capability Partner',
  description:
    'Seven specialist practices. Six global regions. One accountable team that can staff it, build it, test it, and run it.',
};

export default async function Home() {
  // Admin-managed practices and industries; a new/unpublished entry shows up
  // here via ISR tag revalidation. Fetched in parallel — neither depends on
  // the other.
  const [practices, industries] = await Promise.all([getPractices(), getIndustries()]);

  return (
    <>
      {/* 1. Hero — rotating value-prop cards + 1st trust-badge ticker */}
      <ReniusHero />

      {/* 2. Persona fork — "I'm hiring" / "I'm building" / "I'm a candidate" */}
      <ReniusPersonaFork />

      {/* 3. "What We Offer" — Practices carousel + 2nd trust-badge ticker */}
      <ReniusPracticesCarousel practices={practices} />

      {/* 4. "Where We Deliver" — industry strip */}
      <ReniusIndustryStrip industries={industries} />

      {/* 5. "Who We Are" — split content with stat counters */}
      <ReniusWhoWeAre />

      {/* 6. Proof / social-validation strip + quote carousel */}
      <ReniusProofValidation />

      {/* 7. "Our Case Studies" — numbered slider */}
      <ReniusCaseStudySlider />

      {/* 8. Features grid — Governed AI capabilities */}
      <ReniusCapabilitiesGrid />

      {/* 9. CTA band — shaped dark band with circular button device */}
      <ReniusCtaBand />

      {/* 10. Milestones strip — Four years, four phases of growth */}
      <ReniusMilestonesStrip />

      {/* 11. Trust-strip ticker (repeat) */}
      <ReniusTrustStrip />

      {/* 12. "Why Choose Us" — split content with 4-item list & leadership card */}
      <ReniusWhyChooseUs />

      {/* 13. Client logo marquee */}
      <ReniusClientMarquee />

      {/* 14. Insights preview */}
      <ReniusInsightsPreview />
    </>
  );
}