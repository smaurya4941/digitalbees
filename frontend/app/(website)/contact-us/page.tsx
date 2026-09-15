import type { Metadata } from 'next';
import { siteConfig } from '@/config/site';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import PageHeader from '@/components/layout/PageHeader';

import ContactInfo from '@/components/contact/ContactInfo';
import { PersonaContactForm } from '@/components/contact/PersonaContactForm';

export const metadata: Metadata = {
  title: `Contact Us | ${siteConfig.name}`,
  description:
    'Tell us what you are trying to solve — staffing, delivery, or both — and we will route you to the right specialist.',
  alternates: { canonical: `${siteConfig.url}/contact-us` },
};

export default function ContactUsPage() {
  return (
    <>
      <PageHeader title="Contact Us" breadcrumb="Contact Us" />
      <ContactInfo />
      <Section space="lg">
        <Container width="narrow">
          <PersonaContactForm />
        </Container>
      </Section>
    </>
  );
}
