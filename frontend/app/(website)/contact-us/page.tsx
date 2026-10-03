import { Suspense } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Mail, Phone, MapPin, Briefcase } from 'lucide-react';
import { siteConfig } from '@/config/site';
import ContactForm from '@/components/contact/ContactForm';
import { getPractices } from '@/lib/api/practices';
import { getOffices } from '@/lib/api/locations';
import { contactEmail, getSettings, type SiteSettings } from '@/lib/api/settings';

export const metadata: Metadata = {
  title: `Contact Us | ${siteConfig.name}`,
  description:
    'Get in touch with TeamBees about hiring talent, delivery projects or partnerships. We reply within one business day.',
  alternates: { canonical: `${siteConfig.url}/contact-us` },
};

export default async function ContactUsPage() {
  // Contact details (settings) and offices (locations) are admin-managed.
  const [practices, offices, settings] = await Promise.all([
    getPractices(),
    getOffices(),
    getSettings().catch(() => ({}) as SiteSettings),
  ]);
  const practiceOptions = practices.map((p) => ({ slug: p.slug, name: p.name }));
  const email = contactEmail(settings);
  const phone = settings['contact.phone'] || siteConfig.contact.phone;

  return (
    <div className="min-h-screen bg-[#F8F9FF]">
      {/* Hero — top padding clears the fixed NavBar */}
      <section className="border-b border-neutral-200 bg-white pt-28 pb-10 md:pt-36 md:pb-12">
        <div className="mx-auto max-w-container-max px-margin-mobile md:px-margin-desktop">
          <h1 className="text-[36px] font-extrabold leading-tight tracking-tight text-[#0B1F3A] md:text-[48px]">
            Contact us
          </h1>
          <p className="mt-3 max-w-2xl text-body-lg text-ink-muted">
            Tell us what you need and the right team will get back to you within one business day.
          </p>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="mx-auto grid max-w-container-max grid-cols-1 gap-8 px-margin-mobile md:px-margin-desktop lg:grid-cols-12 lg:items-start">
          {/* Form */}
          <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-sm sm:p-8 lg:col-span-8">
            <h2 className="mb-6 text-title-md font-bold text-brand-navy">Send us a message</h2>
            <Suspense fallback={null}>
              <ContactForm practices={practiceOptions} email={email} />
            </Suspense>
          </div>

          {/* Contact details */}
          <aside className="space-y-6 rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-sm sm:p-8 lg:col-span-4">
            <div className="space-y-3">
              <h2 className="text-title-md font-bold text-brand-navy">Reach us directly</h2>
              <a
                href={`mailto:${email}`}
                className="flex items-center gap-3 text-body-md text-ink-muted hover:text-brand-navy"
              >
                <Mail className="h-4 w-4 shrink-0 text-brand-gold-deep" aria-hidden />
                {email}
              </a>
              <a
                href={`tel:${phone.replace(/[^+\d]/g, '')}`}
                className="flex items-center gap-3 text-body-md text-ink-muted hover:text-brand-navy"
              >
                <Phone className="h-4 w-4 shrink-0 text-brand-gold-deep" aria-hidden />
                {phone}
              </a>
            </div>

            {offices.length > 0 && (
              <div className="border-t border-neutral-100 pt-6">
                <h3 className="mb-3 text-body-md font-bold text-brand-navy">Offices</h3>
                <ul className="space-y-3">
                  {offices.map((office) => (
                    <li key={office.slug} className="flex gap-3">
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-gold-deep" aria-hidden />
                      <div>
                        <Link
                          href={office.href}
                          className="text-body-sm font-semibold text-[#0B1F3A] hover:text-brand-gold-deep"
                        >
                          {[office.city ?? office.name, office.country].filter(Boolean).join(', ')}
                        </Link>
                        {office.address && <div className="text-body-sm text-ink-muted">{office.address}</div>}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="border-t border-neutral-100 pt-6">
              <Link
                href="/careers"
                className="flex items-center gap-3 text-body-sm font-semibold text-brand-navy hover:text-brand-gold-deep"
              >
                <Briefcase className="h-4 w-4 shrink-0 text-brand-gold-deep" aria-hidden />
                Looking for a job? See open roles →
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
