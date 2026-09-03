import Image from "next/image";
import Link from "next/link";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { ArrowRight } from "lucide-react";

export default function ServicesGrid() {
  const services = [
    {
      title: "Digital Workforce & Staff Augmentation",
      description: "Dedicated, pre-trained digital marketing experts working as a full-time extension of your team.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDDhQ3btP9PZ5kC7yBpQknnIDFs4zVygF0ri5LOy0r1ZM32PojzjIGrc5menUdp7pLMvq6WDWfutrVxKKS91fmUlRdivtpuXMl1Z7CQCwRHHVFJ9p4lUtWeywv9vQz_IW281cro-EwuQoDdpRqLOXWoXqtm-Zxge0kvSRSmXQkHNF15IuKBAyOUhYfH9mtm7PwN7gL7BcC83wZHKItJii7pFJmDTVot7cEsMvmIKVys9IH2MLf2nys6SRp2tybiQ4uAMYNfWWwr8xY",
      imageShape: "rounded-full rounded-tl-none"
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
    },
    {
      title: "Content Marketing & Strategy",
      description: "Strategic content creation that speaks to your audience and converts prospects into loyal customers.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDDhQ3btP9PZ5kC7yBpQknnIDFs4zVygF0ri5LOy0r1ZM32PojzjIGrc5menUdp7pLMvq6WDWfutrVxKKS91fmUlRdivtpuXMl1Z7CQCwRHHVFJ9p4lUtWeywv9vQz_IW281cro-EwuQoDdpRqLOXWoXqtm-Zxge0kvSRSmXQkHNF15IuKBAyOUhYfH9mtm7PwN7gL7BcC83wZHKItJii7pFJmDTVot7cEsMvmIKVys9IH2MLf2nys6SRp2tybiQ4uAMYNfWWwr8xY",
      imageShape: "rounded-full rounded-tl-none"
    },
    {
      title: "Web & App Development",
      description: "Full-stack development services tailored to build fast, secure, and highly scalable digital products.",
      image: "https://lh3.googleusercontent.com/aida/AEtjO1XuQrSu_E31K0a1YS8Kc_nAY0s8gBoEDiK7qX2RMN3dEOZv7Tn6D_fu1riSsKE2feAbSqwYw1_DiF1pQQPRBzJZ-O1aeGJneH2-KLSbn2uHqcAS6JOsf1-a7iyPbAQF_Z-mUTuQNrSMcSKoI4CuaN89uOfNseDQZPh6i3ngKgCg_y5HJq54JwbJcp4n2EcGkREN34TTT-ZO9a0HA9W8zULRi0NfVa4pdariZqa0KXSCBwMtEMhQY2Pluos",
      imageShape: "rounded-[2rem]"
    },
    {
      title: "Brand Identity & Design",
      description: "Comprehensive branding solutions to ensure your visual identity stands out in a crowded market.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAJ7uWThYWStPcQWHlrqHgFMxdef_ufah-LAq3Sk185rz0Rcl_4OqDyIMn5EJayh-hT8DaifgabOnqiA3jpqay5o4QycxkyonuRiBoCZJsCxr-Z1g_i-19N0qDtL-I3q9XG78QrMZuKaDGnmal-RpdVHaHtn1qaVaie9VcQdr2FtZwoQ9x87JBhms6wiKYBPdcETr4yT8IWz9ufoilZU4BFgDvuT_8bR6u6X9sZlu1R2qnHpXQpIcaNInKO836pFkS2orxYITjez-Y",
      imageShape: "rounded-full rounded-tr-none"
    },
    {
      title: "Data Analytics & Insights",
      description: "Deep dive analytics to uncover trends, optimize campaigns, and drive data-informed decisions.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBr9SNXYFPQ6wPzBuetoKUOTNsjOdqafbe6bCISTzQanOHq_TpBpFu9oYEu-8ytjT9Oy4lrjouUgZ87LF6iLWidX5RYaIbiXlmf5vFViGPY_dI34i-IofgjEG37RO6MxqyUiGK5_fRk7Cb6uE9LDFJBUpH_7cciJSsenRw3n7F2invY3xtnaPNioJZJRm_Msia6AZLNihJZz0khzNHLJCSZa15RvP4Uw4urydRGJqYs22MHOBCUHMeua2KDYINOSMDx6yjTMFaxWuM",
      imageShape: "rounded-full"
    }
  ];

  return (
    <section className="py-24 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto bg-white">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 gap-y-16">
        {services.map((service, index) => (
          <ScrollReveal key={index} delay={0.1 * (index % 4)}>
            <div className="flex flex-col h-full group cursor-pointer">
              <div className={`w-full aspect-square ${service.imageShape} overflow-hidden mb-8 relative transition-transform duration-300 group-hover:-translate-y-2 shadow-[0_10px_40px_rgb(0,0,0,0.05)] bg-[#F4EDE4]`}>
                <Image
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 mix-blend-multiply"
                  src={service.image}
                  alt={service.title}
                  fill
                />
              </div>
              <h4 className="text-[22px] font-bold text-ink mb-4 leading-tight transition-colors group-hover:text-[#FACC15]">
                {service.title}
              </h4>
              <p className="text-ink-muted text-[15px] mb-6 flex-grow leading-relaxed">
                {service.description}
              </p>
              <Link 
                href="#" 
                className="text-[#FACC15] font-bold text-sm flex items-center gap-2 group-hover:gap-3 transition-all"
              >
                Read More <ArrowRight size={16} strokeWidth={2.5} />
              </Link>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
