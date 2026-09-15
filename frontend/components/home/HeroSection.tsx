import { Hero } from '@/components/sections/Hero';

export default function HeroSection() {
  return (
    <Hero
      content={{
        eyebrow: "Global Talent & Technology Partner",
        title: "Talent and technology, from the same partner.",
        description: "Seven specialist practices. Six global regions. One team that can staff it, build it, test it, and run it — so you're never choosing between speed and quality.",
        cta: {
          label: "Book a Consultation",
          url: "/contact-us"
        },
        secondary_cta: {
          label: "Explore Our Practices",
          url: "/practices"
        }
      }}
      tone="navy"
    />
  );
}
