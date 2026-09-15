import ScrollReveal from "@/components/ui/ScrollReveal";
import { Phone, Mail, MapPin } from "lucide-react";
import { siteConfig } from "@/config/site";
import { getSettings, type SiteSettings } from "@/lib/api/settings";

/**
 * Direct-contact paths for the contact page. Values come from the CMS
 * (`settings`) with `siteConfig` as the build-time fallback, so the brand's
 * contact details are never hardcoded in a component.
 */
export default async function ContactInfo() {
  const settings = await getSettings().catch(() => ({}) as SiteSettings);

  const email = settings['contact.email'] || siteConfig.contact.email;
  const phone = settings['contact.phone'] || siteConfig.contact.phone;

  const contactDetails = [
    {
      icon: <Phone size={24} />,
      label: "PHONE NUMBER",
      value: phone,
      href: `tel:${phone.replace(/[^+\d]/g, "")}`,
    },
    {
      icon: <Mail size={24} />,
      label: "Email",
      value: email,
      href: `mailto:${email}`,
    },
    {
      icon: <MapPin size={24} />,
      label: "Global Presence",
      value: siteConfig.contact.presence,
      href: null,
    },
  ];

  return (
    <section className="py-24 px-margin-mobile md:px-margin-desktop bg-white">
      <div className="max-w-container-max mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {contactDetails.map((detail, index) => (
            <ScrollReveal key={detail.label} delay={0.1 * index}>
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
                  {detail.href ? (
                    <a
                      href={detail.href}
                      className="text-ink-muted text-[15px] leading-relaxed transition-colors hover:text-ink"
                    >
                      {detail.value}
                    </a>
                  ) : (
                    <p className="text-ink-muted text-[15px] leading-relaxed">
                      {detail.value}
                    </p>
                  )}
                </div>

              </div>
            </ScrollReveal>
          ))}

        </div>
      </div>
    </section>
  );
}
