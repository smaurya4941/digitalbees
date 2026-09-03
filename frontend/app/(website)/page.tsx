import HeroSection from '@/components/home/HeroSection';
import { InfiniteMarquee } from '@/components/ui/InfiniteMarquee';
import ServicesSection from '@/components/home/ServicesSection';
import AboutSection from '@/components/home/AboutSection';
import ProjectsSection from '@/components/home/ProjectsSection';
import AdvantageSection from '@/components/home/AdvantageSection';
import CtaSection from '@/components/home/CtaSection';
import AwardsSection from '@/components/home/AwardsSection';
import WhyChooseUsSection from '@/components/home/WhyChooseUsSection';
import ArticlesSection from '@/components/home/ArticlesSection';

export default function Home() {
  const marqueeItems = [
    "Performance Marketing",
    "Digital Workforce",
    "Scalable Growth",
    "AI Integration",
    "Brand Excellence"
  ];

  return (
    <>
      <HeroSection />
      <InfiniteMarquee items={marqueeItems} speed="slow" />
      <ServicesSection />
      <AboutSection />
      <ProjectsSection />
      <AdvantageSection />
      <CtaSection />
      <AwardsSection />
      <WhyChooseUsSection />
      <ArticlesSection />
    </>
  );
}
