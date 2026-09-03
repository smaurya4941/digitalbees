import ScrollReveal from "@/components/ui/ScrollReveal";
import { Phone, Mail, MapPin } from "lucide-react";

export default function ContactInfo() {
  const contactDetails = [
    {
      icon: <Phone size={24} />,
      label: "PHONE NUMBER",
      value: "+91 836 879 0581"
    },
    {
      icon: <Mail size={24} />,
      label: "Email",
      value: "care@thedigitalbees.in"
    },
    {
      icon: <MapPin size={24} />,
      label: "Location",
      value: "Tower B3 in Spaze I Tech Park, 337-338, Sector 49, Gurugram, Haryana, 122001"
    }
  ];

  return (
    <section className="py-24 px-margin-mobile md:px-margin-desktop bg-white">
      <div className="max-w-container-max mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {contactDetails.map((detail, index) => (
            <ScrollReveal key={index} delay={0.1 * index}>
              <div className="bg-[#F9F9F9] rounded-[2rem] p-8 md:p-10 flex items-center gap-6 h-full hover:-translate-y-1 transition-transform duration-300">
                
                {/* Icon Container */}
                <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center text-white flex-shrink-0 shadow-lg">
                  {detail.icon}
                </div>
                
                {/* Content */}
                <div className="flex flex-col">
                  <h4 className="text-ink font-bold text-[14px] uppercase tracking-wider mb-1 font-mono">
                    {detail.label}
                  </h4>
                  <p className="text-ink-muted text-[15px] leading-relaxed">
                    {detail.value}
                  </p>
                </div>

              </div>
            </ScrollReveal>
          ))}
          
        </div>
      </div>
    </section>
  );
}
