import Image from "next/image";
import ScrollReveal from "@/components/ui/ScrollReveal";

export default function AboutSection() {
  return (
    <section className="py-0">
      <div className="flex flex-col lg:flex-row w-full min-h-[80vh]">
        {/* Left Image */}
        <div className="w-full lg:w-1/2 min-h-[50vh] lg:min-h-full relative">
          <Image
            className="w-full h-full object-cover"
            src="https://lh3.googleusercontent.com/aida/AEtjO1VWIjkRoSXUrPQdI9z-rrEX5qhEmu2wFizX7I8wv2nmEL5UNbJoEzYsQFfg_PCx3iR8LbkXh7kDMPyiZoY2NZfjjVfpUFVv7tsBi6uh3wvhswNDiLOpH6aOKtE-GaIlYabc3EQ1_ivxCEmFnE_Wniq9dlaTl6H0zGA9V9iKiqFwEta6Tn67Br2fvrUGPi0jq1ZNHA127c_nhRf8MePgXk_sGpWgiTfjBKNNIid7fmeaACn0F4q-AOM5fA"
            alt="Office space"
            fill
          />
        </div>
        {/* Right Content */}
        <div className="w-full lg:w-1/2 bg-primary-container text-white p-margin-mobile lg:p-margin-desktop flex flex-col justify-center">
          <div className="max-w-xl mx-auto lg:mx-0">
            <ScrollReveal>
              <span className="inline-block text-gold-muted font-label-sm text-label-sm uppercase tracking-wider mb-6">Who We Are</span>
              <h2 className="font-headline-xl text-headline-xl mb-10 leading-tight">
                We Are A <span className="font-bold">Top Technology Partner Fully Invested</span> In Our Clients' Success
              </h2>
            </ScrollReveal>
            <ul className="space-y-4 mb-12">
              {[
                "Dedicated engineering pods tailored to your stack.",
                "Rigorous vetting process for top 1% talent.",
                "Transparent, agile delivery methodologies.",
                "Focus on long-term enterprise value creation."
              ].map((text, i) => (
                <ScrollReveal key={i} delay={0.1 * (i + 1)}>
                  <li className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-gold-muted mt-1" style={{ fontVariationSettings: '"FILL" 1' }}>check_circle</span>
                    <span className="font-body-lg text-body-lg text-surface-container-high">{text}</span>
                  </li>
                </ScrollReveal>
              ))}
            </ul>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { value: "500+", label: "Experts" },
                { value: "25+", label: "Global Hubs" },
                { value: "$2B+", label: "Value" }
              ].map((stat, i) => (
                <ScrollReveal key={i} delay={0.4 + (0.1 * i)} yOffset={20}>
                  <div className="bg-navy-deep p-6 rounded border border-white/5 hover:border-gold-muted/30 transition-colors duration-300">
                    <div className="text-gold-muted font-display-lg text-3xl font-bold mb-1">{stat.value}</div>
                    <div className="text-surface-variant text-sm uppercase tracking-wider">{stat.label}</div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
