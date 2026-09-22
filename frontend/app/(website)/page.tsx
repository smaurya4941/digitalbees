import ReniusHero from '@/components/home/renius/ReniusHero';
import ReniusPracticesCarousel from '@/components/home/renius/ReniusPracticesCarousel';
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

export const metadata = {
  title: 'TeamBees — Global Talent & Capability Partner',
  description:
    'Seven specialist practices. Six global regions. One accountable team that can staff it, build it, test it, and run it.',
};

export default function Home() {
  return (
    <>
      {/* 2. Hero — rotating value-prop cards + 1st trust-badge ticker */}
      <ReniusHero />

      {/* 3. "What We Offer" — Practices carousel + 2nd trust-badge ticker */}
      <ReniusPracticesCarousel />

      {/* 4. "Who We Are" — split content with stat counters */}
      <ReniusWhoWeAre />

      {/* 5. Proof / social-validation strip + quote carousel */}
      <ReniusProofValidation />

      {/* 6. "Our Case Studies" — numbered slider */}
      <ReniusCaseStudySlider />

      {/* 7. Features grid — Governed AI capabilities */}
      <ReniusCapabilitiesGrid />

      {/* 8. CTA band — shaped dark band with circular button device */}
      <ReniusCtaBand />

      {/* 9. Milestones strip — Four years, four phases of growth */}
      <ReniusMilestonesStrip />

      {/* 10. Trust-strip ticker (repeat) */}
      <ReniusTrustStrip />

      {/* 11. "Why Choose Us" — split content with 4-item list & leadership card */}
      <ReniusWhyChooseUs />

      {/* 12. Client logo marquee */}
      <ReniusClientMarquee />

      {/* 13. Insights preview */}
      <ReniusInsightsPreview />
    </>
  );
}