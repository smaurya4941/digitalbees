import Image from "next/image";
import Link from "next/link";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { ArrowRight, ArrowLeft } from "lucide-react";

export default function ServicesSection() {
  const services = [
    {
      title: "Digital Workforce & Staff Augmentation",
      description: "Dedicated, pre-trained digital marketing experts working as a full-time extension of your team.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDDhQ3btP9PZ5kC7yBpQknnIDFs4zVygF0ri5LOy0r1ZM32PojzjIGrc5menUdp7pLMvq6WDWfutrVxKKS91fmUlRdivtpuXMl1Z7CQCwRHHVFJ9p4lUtWeywv9vQz_IW281cro-EwuQoDdpRqLOXWoXqtm-Zxge0kvSRSmXQkHNF15IuKBAyOUhYfH9mtm7PwN7gL7BcC83wZHKItJii7pFJmDTVot7cEsMvmIKVys9IH2MLf2nys6SRp2tybiQ4uAMYNfWWwr8xY",
      imageShape: "rounded-full"
    },
    {
      title: "Performance Marketing & Paid Ads",
      description: "Media buyers and paid ad specialists engineered to scale your digital acquisition engine.",
      image: "https://lh3.googleusercontent.com/aida/AEtjO1XuQrSu_E31K0a1YS8Kc_nAY0s8gBoEDiK7qX2RMN3dEOZv7Tn6D_fu1riSsKE2feAbSqwYw1_DiF1pQQPRBzJZ-O1aeGJneH2-KLSbn2uHqcAS6JOsf1-a7iyPbAQF_Z-mUTuQNrSMcSKoI4CuaN89uOfNseDQZPh6i3ngKgCg_y5HJq54JwbJcp4n2EcGkREN34TTT-ZO9a0HA9W8zULRi0NfVa4pdariZqa0KXSCBwMtEMhQY2Pluos",
      imageShape: "rounded-[2rem]"
    },
    {
      title: "AI-Powered SEO & Optimization",
      description: "Advanced search engine optimization managed by specialized copywriters and brand storytellers.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAJ7uWThYWStPcQWHlrqHgFMxdef_ufah-LAq3Sk185rz0Rcl_4OqDyIMn5EJayh-hT8DaifgabOnqiA3jpqay5o4QycxkyonuRiBoCZJsCxr-Z1g_i-19N0qDtL-I3q9XG78QrMZuKaDGnmal-RpdVHaHtn1qaVaie9VcQdr2FtZwoQ9x87JBhms6wiKYBPdcETr4yT8IWz9ufoilZU4BFgDvuT_8bR6u6X9sZlu1R2qnHpXQpIcaNInKO836pFkS2orxYITjez-Y",
      imageShape: "rounded-full rounded-tr-none"
    },
    {
      title: "Social Media Management",
      description: "Specialized managers built to grow your brand engagement, content strategy, and digital consistency.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBr9SNXYFPQ6wPzBuetoKUOTNsjOdqafbe6bCISTzQanOHq_TpBpFu9oYEu-8ytjT9Oy4lrjouUgZ87LF6iLWidX5RYaIbiXlmf5vFViGPY_dI34i-IofgjEG37RO6MxqyUiGK5_fRk7Cb6uE9LDFJBUpH_7cciJSsenRw3n7F2invY3xtnaPNioJZJRm_Msia6AZLNihJZz0khzNHLJCSZa15RvP4Uw4urydRGJqYs22MHOBCUHMeua2KDYINOSMDx6yjTMFaxWuM",
      imageShape: "rounded-full"
    }
  ];

  return (
    <section className="py-24 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto bg-white">
      <ScrollReveal>
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-16">
          <div className="max-w-4xl">
            <div className="flex items-center gap-2 mb-4">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#FACC15]">
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
              <span className="text-[#FACC15] font-bold text-xs uppercase tracking-[0.2em]">
                WHAT WE OFFER
              </span>
            </div>
            <h2 className="text-[36px] md:text-[48px] leading-[1.2] text-ink tracking-tight">
              Take A Brief <span className="font-bold">Look At The Digital</span><br className="hidden md:block"/>
              <span className="font-bold">Growth Solutions</span> We Offer
            </h2>
          </div>
          <div className="flex gap-4 mt-8 lg:mt-0">
            <button className="w-12 h-12 rounded-full bg-transparent border border-[#FACC15]/40 text-[#FACC15] flex items-center justify-center transition-colors hover:bg-[#FACC15] hover:text-white">
              <ArrowLeft size={20} strokeWidth={1.5} />
            </button>
            <button className="w-12 h-12 rounded-full bg-transparent border border-[#FACC15]/40 text-[#FACC15] flex items-center justify-center transition-colors hover:bg-[#FACC15] hover:text-white">
              <ArrowRight size={20} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </ScrollReveal>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {services.map((service, index) => (
          <ScrollReveal key={index} delay={0.1 * (index + 1)}>
            <div className="flex flex-col h-full group cursor-pointer text-left">
              <div className={`w-full aspect-square ${service.imageShape} overflow-hidden mb-6 relative transition-transform duration-300 group-hover:-translate-y-2 bg-[#F4EDE4]`}>
                <Image
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 mix-blend-multiply"
                  src={service.image}
                  alt={service.title}
                  fill
                />
              </div>
              <h4 className="text-[20px] lg:text-[22px] font-bold text-ink mb-4 leading-tight transition-colors group-hover:text-[#FACC15]">
                {service.title}
              </h4>
              <p className="text-ink-muted text-[14px] lg:text-[15px] mb-6 flex-grow leading-relaxed">
                {service.description}
              </p>
              <Link 
                href="#" 
                className="text-[#FACC15] font-bold text-sm flex items-center gap-2 group-hover:gap-3 transition-all w-fit"
              >
                Read More <ArrowRight size={16} strokeWidth={1.5} />
              </Link>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
