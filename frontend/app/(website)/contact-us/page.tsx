import type { Metadata } from 'next';
import { siteConfig } from '@/config/site';
import PageHeader from '@/components/layout/PageHeader';

import ContactInfo from '@/components/contact/ContactInfo';
import ContactForm from '@/components/contact/ContactForm';

export const metadata: Metadata = {
  title: 'Contact Us | The Digital Bees',
  description: "Reach out to us to deploy pre-trained, performance-ready digital experts tailored to your business needs.",
  alternates: { canonical: `${siteConfig.url}/contact-us` },
};

export default function ContactUsPage() {
  return (
    <>
      <PageHeader title="Contact Us" breadcrumb="Contact Us" />
      <ContactInfo />
      <ContactForm />
    </>
  );
}
