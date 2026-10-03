import ReniusHero from '@/components/home/renius/ReniusHero';
import ReniusPersonaFork from '@/components/home/renius/ReniusPersonaFork';
import ReniusPracticesCarousel from '@/components/home/renius/ReniusPracticesCarousel';
import ReniusIndustryStrip from '@/components/home/renius/ReniusIndustryStrip';
import ReniusWhoWeAre from '@/components/home/renius/ReniusWhoWeAre';
import ReniusProofValidation from '@/components/home/renius/ReniusProofValidation';
import ReniusCaseStudySlider from '@/components/home/renius/ReniusCaseStudySlider';
import ReniusClientMarquee from '@/components/home/renius/ReniusClientMarquee';
import ReniusBlogPreview from '@/components/home/renius/ReniusBlogPreview';
import ReniusCtaBand from '@/components/home/renius/ReniusCtaBand';
import { getPractices } from '@/lib/api/practices';
import { getIndustries } from '@/lib/api/industries';
import { getCaseStudies } from '@/lib/api/case-studies';
import { getBlogPosts } from '@/lib/api/blog';
import { getTestimonials } from '@/lib/api/testimonials';
import { getClientLogos } from '@/lib/api/company';
import { companyFacts, getCompanyFacts, getSettings, type SiteSettings } from '@/lib/api/settings';
import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const { marketsLabel } = await getCompanyFacts();

  return {
    title: 'TeamBees — Global Talent & Capability Partner',
    description: `Seven specialist practices, delivered from ${marketsLabel}. One accountable team that can staff it, build it, test it, and run it.`,
  };
}

export default async function Home() {
  // Admin-managed content; a new/unpublished entry shows up here via ISR tag
  // revalidation. Fetched in parallel — none depends on another.
  const [practices, industries, caseStudies, latestPosts, testimonials, clientLogos, settings] = await Promise.all([
    getPractices(),
    getIndustries(),
    getCaseStudies(),
    getBlogPosts({ perPage: 3 }),
    getTestimonials('home'),
    getClientLogos(),
    getSettings().catch(() => ({}) as SiteSettings),
  ]);
  const facts = companyFacts(settings);

  return (
    <>
      {/* 1. Hero — rotating image banner with value-prop cards */}
      <ReniusHero
        practiceHrefs={practices.map((p) => p.href)}
        videoUrl={settings['home.hero_video_url']}
        videoTitle={settings['home.hero_video_title']}
        facts={facts}
      />

      {/* 2. Persona fork — "I'm hiring" / "I'm building" / "I'm a candidate" */}
      <ReniusPersonaFork shortlistTurnaround={facts.shortlistTurnaround} />

      {/* 3. "What We Offer" — practices carousel */}
      <ReniusPracticesCarousel practices={practices} shortlistTurnaround={facts.shortlistTurnaround} />

      {/* 4. "Where We Deliver" — industry strip */}
      <ReniusIndustryStrip industries={industries} />

      {/* 5. "Who We Are" — image panel with stat counters */}
      <ReniusWhoWeAre facts={facts} />

      {/* 6. Proof / social-validation strip + quote carousel */}
      <ReniusProofValidation testimonials={testimonials} shortlistTurnaround={facts.shortlistTurnaround} />

      {/* 7. Case studies slider */}
      <ReniusCaseStudySlider caseStudies={caseStudies.slice(0, 6)} />

      {/* 8. Client logo marquee */}
      <ReniusClientMarquee logos={clientLogos} />

      {/* 9. Blog — latest posts */}
      <ReniusBlogPreview posts={latestPosts.items.slice(0, 3)} />

      {/* 10. Closing CTA band */}
      <ReniusCtaBand shortlistTurnaround={facts.shortlistTurnaround} />
    </>
  );
}
