import HeroSection from '@/components/home/HeroSection';
import ServicesSection from '@/components/home/ServicesSection';
import AboutSection from '@/components/home/AboutSection';
import ProjectsSection from '@/components/home/ProjectsSection';
import AdvantageSection from '@/components/home/AdvantageSection';
import CtaSection from '@/components/home/CtaSection';
import AwardsSection from '@/components/home/AwardsSection';
import WhyChooseUsSection from '@/components/home/WhyChooseUsSection';
import ArticlesSection from '@/components/home/ArticlesSection';

export default function Home() {
  return (
    <>
      <HeroSection />
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
