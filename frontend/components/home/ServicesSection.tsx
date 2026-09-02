import Image from "next/image";
import ScrollReveal from "@/components/ui/ScrollReveal";

export default function ServicesSection() {
  return (
    <section className="py-24 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
      <ScrollReveal>
        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
          <div className="max-w-2xl">
            <span className="inline-block text-gold-muted font-label-sm text-label-sm uppercase tracking-wider mb-4">Our Practices</span>
            <h2 className="font-headline-xl text-headline-xl text-primary">
              Take A Brief <span className="font-bold">Look At Some Of The Expertise</span> We Offer
            </h2>
          </div>
          <div className="flex gap-4 mt-6 md:mt-0">
            <button className="w-12 h-12 rounded-full border border-outline flex items-center justify-center text-primary hover:bg-surface-container-high transition-colors">
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <button className="w-12 h-12 rounded-full bg-navy-deep text-white flex items-center justify-center hover:bg-primary transition-colors">
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </div>
        </div>
      </ScrollReveal>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Service Card 1 */}
        <ScrollReveal delay={0.1}>
          <div className="bg-surface-ivory border border-outline-variant/30 rounded-lg overflow-hidden group hover:-translate-y-2 hover:shadow-[0px_20px_40px_rgba(11,31,58,0.08)] transition-all duration-300 h-full">
            <div className="h-48 overflow-hidden rounded-t-lg relative">
              <Image
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDDhQ3btP9PZ5kC7yBpQknnIDFs4zVygF0ri5LOy0r1ZM32PojzjIGrc5menUdp7pLMvq6WDWfutrVxKKS91fmUlRdivtpuXMl1Z7CQCwRHHVFJ9p4lUtWeywv9vQz_IW281cro-EwuQoDdpRqLOXWoXqtm-Zxge0kvSRSmXQkHNF15IuKBAyOUhYfH9mtm7PwN7gL7BcC83wZHKItJii7pFJmDTVot7cEsMvmIKVys9IH2MLf2nys6SRp2tybiQ4uAMYNfWWwr8xY"
                alt="Talent Bees"
                fill
              />
            </div>
            <div className="p-6">
              <h4 className="font-title-md text-title-md text-primary font-bold mb-2">Talent Bees</h4>
              <p className="text-on-surface-variant text-sm">Dedicated engineering teams embedded directly into your workflows.</p>
            </div>
          </div>
        </ScrollReveal>
        {/* Service Card 2 */}
        <ScrollReveal delay={0.2}>
          <div className="bg-surface-ivory border border-outline-variant/30 rounded-lg overflow-hidden group hover:-translate-y-2 hover:shadow-[0px_20px_40px_rgba(11,31,58,0.08)] transition-all duration-300 h-full">
            <div className="h-48 overflow-hidden rounded-t-lg relative">
              <Image
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                src="https://lh3.googleusercontent.com/aida/AEtjO1XuQrSu_E31K0a1YS8Kc_nAY0s8gBoEDiK7qX2RMN3dEOZv7Tn6D_fu1riSsKE2feAbSqwYw1_DiF1pQQPRBzJZ-O1aeGJneH2-KLSbn2uHqcAS6JOsf1-a7iyPbAQF_Z-mUTuQNrSMcSKoI4CuaN89uOfNseDQZPh6i3ngKgCg_y5HJq54JwbJcp4n2EcGkREN34TTT-ZO9a0HA9W8zULRi0NfVa4pdariZqa0KXSCBwMtEMhQY2Pluos"
                alt="AI Bees"
                fill
              />
            </div>
            <div className="p-6">
              <h4 className="font-title-md text-title-md text-primary font-bold mb-2">AI Bees</h4>
              <p className="text-on-surface-variant text-sm">Intelligent production agents automating complex enterprise tasks.</p>
            </div>
          </div>
        </ScrollReveal>
        {/* Service Card 3 */}
        <ScrollReveal delay={0.3}>
          <div className="bg-surface-ivory border border-outline-variant/30 rounded-lg overflow-hidden group hover:-translate-y-2 hover:shadow-[0px_20px_40px_rgba(11,31,58,0.08)] transition-all duration-300 h-full">
            <div className="h-48 overflow-hidden rounded-t-lg relative">
              <Image
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAJ7uWThYWStPcQWHlrqHgFMxdef_ufah-LAq3Sk185rz0Rcl_4OqDyIMn5EJayh-hT8DaifgabOnqiA3jpqay5o4QycxkyonuRiBoCZJsCxr-Z1g_i-19N0qDtL-I3q9XG78QrMZuKaDGnmal-RpdVHaHtn1qaVaie9VcQdr2FtZwoQ9x87JBhms6wiKYBPdcETr4yT8IWz9ufoilZU4BFgDvuT_8bR6u6X9sZlu1R2qnHpXQpIcaNInKO836pFkS2orxYITjez-Y"
                alt="Digital Bees"
                fill
              />
            </div>
            <div className="p-6">
              <h4 className="font-title-md text-title-md text-primary font-bold mb-2">Digital Bees</h4>
              <p className="text-on-surface-variant text-sm">Comprehensive digital transformation and cloud modernization strategies.</p>
            </div>
          </div>
        </ScrollReveal>
        {/* Service Card 4 */}
        <ScrollReveal delay={0.4}>
          <div className="bg-surface-ivory border border-outline-variant/30 rounded-lg overflow-hidden group hover:-translate-y-2 hover:shadow-[0px_20px_40px_rgba(11,31,58,0.08)] transition-all duration-300 h-full">
            <div className="h-48 overflow-hidden rounded-t-lg relative">
              <Image
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBr9SNXYFPQ6wPzBuetoKUOTNsjOdqafbe6bCISTzQanOHq_TpBpFu9oYEu-8ytjT9Oy4lrjouUgZ87LF6iLWidX5RYaIbiXlmf5vFViGPY_dI34i-IofgjEG37RO6MxqyUiGK5_fRk7Cb6uE9LDFJBUpH_7cciJSsenRw3n7F2invY3xtnaPNioJZJRm_Msia6AZLNihJZz0khzNHLJCSZa15RvP4Uw4urydRGJqYs22MHOBCUHMeua2KDYINOSMDx6yjTMFaxWuM"
                alt="Cyber Bees"
                fill
              />
            </div>
            <div className="p-6">
              <h4 className="font-title-md text-title-md text-primary font-bold mb-2">Cyber Bees</h4>
              <p className="text-on-surface-variant text-sm">Enterprise-grade security architecture and compliance frameworks.</p>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
