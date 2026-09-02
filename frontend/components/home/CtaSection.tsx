import RotatingBadge from "@/components/ui/RotatingBadge";
import ScrollReveal from "@/components/ui/ScrollReveal";

export default function CtaSection() {
  return (
    <section className="px-margin-mobile md:px-margin-desktop py-12">
      <ScrollReveal>
        <div className="rounded-[2rem] bg-gradient-to-r from-navy-deep to-[#a67c2e] p-12 flex flex-col lg:flex-row items-center justify-between gap-8">
          <h2 className="text-white text-headline-xl font-bold max-w-2xl leading-tight">
            Let's Build Your <span className="text-secondary-fixed">Enterprise Team Today</span> - Contact Us For A Consultation!
          </h2>
          <RotatingBadge text="SCHEDULE A VISIT • SCHEDULE A VISIT • " icon="arrow" size="lg" />
        </div>
      </ScrollReveal>
    </section>
  );
}
