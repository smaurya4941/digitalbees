import PageHeader from '@/components/layout/PageHeader';
import AboutUsHero from '@/components/about/AboutUsHero';
import AboutFeatures from '@/components/about/AboutFeatures';
import AboutBanner from '@/components/about/AboutBanner';
import AboutTestimonials from '@/components/about/AboutTestimonials';
import AboutWhyWorkWithUs from '@/components/about/AboutWhyWorkWithUs';

export const metadata = {
  title: 'About Us | The Digital Bees',
  description: 'Our commitment to bridging the gap between digital workforce solutions and exceptional talent is unwavering.',
};

export default function AboutUsPage() {
  return (
    <>
      <PageHeader title="About Us" breadcrumb="About Us" />
      <AboutUsHero />
      <AboutFeatures />
      <AboutBanner />
      <AboutTestimonials />
      <AboutWhyWorkWithUs />
    </>
  );
}
