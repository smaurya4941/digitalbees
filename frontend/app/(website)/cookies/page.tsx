import type { Metadata } from 'next';
import Link from 'next/link';
import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import PageHeader from '@/components/layout/PageHeader';
import { routes } from '@/config/routes';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: `Cookie Policy | Legal & Compliance | ${siteConfig.name}`,
  description:
    'Learn how TeamBees Corp uses cookies, pixels, and tracking technologies to ensure platform security, analyze performance, and govern user privacy.',
  alternates: { canonical: `${siteConfig.url}${routes.cookies()}` },
};

const ESSENTIAL_COOKIES = [
  {
    name: 'XSRF-TOKEN',
    provider: new URL(siteConfig.url).hostname,
    purpose: 'Cryptographic token used to prevent Cross-Site Request Forgery (CSRF) attacks on lead forms and interactive inquiries.',
    retention: 'Session',
    type: 'First-Party / Essential',
  },
  {
    name: 'teambees_session',
    provider: new URL(siteConfig.url).hostname,
    purpose: 'Maintains encrypted application session state, authentication tokens for portal access, and form progress.',
    retention: '2 Hours / Idle',
    type: 'First-Party / Essential',
  },
  {
    name: 'cookie_consent',
    provider: new URL(siteConfig.url).hostname,
    purpose: 'Stores your preferences and consent selections regarding non-essential cookie categories.',
    retention: '1 Year',
    type: 'First-Party / Essential',
  },
];

const FUNCTIONAL_COOKIES = [
  {
    name: 'tb_region',
    provider: new URL(siteConfig.url).hostname,
    purpose: 'Stores your preferred regional hub (USA, UK, UAE, India, Singapore) to route inquiries to sovereign delivery leads.',
    retention: '6 Months',
    type: 'First-Party / Functional',
  },
  {
    name: 'tb_theme',
    provider: new URL(siteConfig.url).hostname,
    purpose: 'Remembers user interface appearance preferences (Dark Mode / High Contrast / System Default).',
    retention: '1 Year',
    type: 'First-Party / Functional',
  },
];

const ANALYTICS_COOKIES = [
  {
    name: '_tb_telemetry',
    provider: new URL(siteConfig.url).hostname,
    purpose: 'Collects aggregated, pseudonymous metrics regarding page response times, navigation patterns, and Core Web Vitals.',
    retention: '30 Days',
    type: 'First-Party / Performance',
  },
  {
    name: '_tb_search_query',
    provider: new URL(siteConfig.url).hostname,
    purpose: 'Analyzes anonymous search query effectiveness to optimize taxonomy indexing and case study retrieval.',
    retention: 'Session',
    type: 'First-Party / Performance',
  },
];

const MARKETING_COOKIES = [
  {
    name: '_li_insight',
    provider: 'LinkedIn Corporation',
    purpose: 'Measures campaign response and enterprise buyer engagement with B2B whitepapers, reports, and case studies.',
    retention: '90 Days',
    type: 'Third-Party / Marketing',
  },
];

export default function CookiePolicyPage() {
  return (
    <>
      <PageHeader title="Cookie Policy" breadcrumb="Legal / Cookie Policy" />

      <Section space="md">
        <Container width="narrow">
          <div className="prose prose-neutral dark:prose-invert max-w-none text-ink">
            {/* Meta Header */}
            <div className="border-b border-hairline pb-6 mb-8">
              <span className="font-mono text-xs text-brand-gold uppercase tracking-wider font-semibold">
                Governance &amp; Privacy Standard
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-ink tracking-tight mt-1">
                TeamBees Cookie Policy
              </h1>
              <p className="mt-2 text-sm text-ink-muted">
                Effective Date: September 1, 2026 &bull; Last Reviewed: September 19, 2026
              </p>
            </div>

            {/* Section 1 */}
            <h2 className="text-2xl font-bold text-ink tracking-tight mt-10 mb-4">
              1. Introduction &amp; Scope
            </h2>
            <p className="text-body-base text-ink-muted leading-relaxed">
              This Cookie Policy explains how <strong>{siteConfig.legalName}</strong> (&ldquo;TeamBees,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) uses cookies, web beacons, local storage, and related tracking technologies across our corporate website ({siteConfig.url}), client portals, and related digital properties.
            </p>
            <p className="text-body-base text-ink-muted leading-relaxed mt-4">
              We take sovereign data protection seriously. In accordance with the EU General Data Protection Regulation (GDPR), UK Data Protection Act / PECR, California Consumer Privacy Act (CCPA/CPRA), and UAE Data Protection Law, we prioritize transparency and ensure that you maintain full control over the data stored on your device.
            </p>

            {/* Section 2 */}
            <h2 className="text-2xl font-bold text-ink tracking-tight mt-12 mb-4">
              2. What Are Cookies and Tracking Technologies?
            </h2>
            <p className="text-body-base text-ink-muted leading-relaxed">
              A cookie is a small alphanumeric text file placed on your computer, tablet, or mobile device when you browse websites. Cookies allow a website to recognize your device, remember user preferences, facilitate secure authentication, and aggregate anonymized analytics.
            </p>
            <p className="text-body-base text-ink-muted leading-relaxed mt-4">
              In addition to standard HTTP cookies, we may use localized session storage and pixel tags to authenticate API requests, protect forms against automated spam/bot attacks, and evaluate the delivery performance of our technical resources.
            </p>

            {/* Section 3 */}
            <h2 className="text-2xl font-bold text-ink tracking-tight mt-12 mb-4">
              3. Categories of Cookies We Use
            </h2>
            <p className="text-body-base text-ink-muted leading-relaxed">
              We group the cookies used on our web platform into four primary classifications:
            </p>

            {/* Category 1 Table */}
            <div className="mt-8">
              <h3 className="text-xl font-bold text-ink mb-2">3.1 Strictly Necessary Cookies (Essential)</h3>
              <p className="text-sm text-ink-muted mb-4">
                These cookies are strictly required for the core functionality of the website, including security tokens, load balancing, and anti-abuse verification. They cannot be deactivated in our systems.
              </p>
              <div className="overflow-x-auto rounded-2xl border border-hairline shadow-sm">
                <table className="w-full text-left text-sm">
                  <thead className="bg-surface-ivory dark:bg-white/5 border-b border-hairline font-mono text-xs uppercase text-ink">
                    <tr>
                      <th className="p-3.5">Cookie Name</th>
                      <th className="p-3.5">Provider</th>
                      <th className="p-3.5">Purpose</th>
                      <th className="p-3.5">Retention</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-hairline">
                    {ESSENTIAL_COOKIES.map((c) => (
                      <tr key={c.name} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                        <td className="p-3.5 font-mono font-bold text-brand-gold text-xs">{c.name}</td>
                        <td className="p-3.5 text-ink-muted text-xs">{c.provider}</td>
                        <td className="p-3.5 text-ink text-xs leading-relaxed">{c.purpose}</td>
                        <td className="p-3.5 text-ink-muted text-xs whitespace-nowrap">{c.retention}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Category 2 Table */}
            <div className="mt-10">
              <h3 className="text-xl font-bold text-ink mb-2">3.2 Functional &amp; Preference Cookies</h3>
              <p className="text-sm text-ink-muted mb-4">
                These cookies enable enhanced personalization, remembering your regional preferences, currency, and persona settings across sessions.
              </p>
              <div className="overflow-x-auto rounded-2xl border border-hairline shadow-sm">
                <table className="w-full text-left text-sm">
                  <thead className="bg-surface-ivory dark:bg-white/5 border-b border-hairline font-mono text-xs uppercase text-ink">
                    <tr>
                      <th className="p-3.5">Cookie Name</th>
                      <th className="p-3.5">Provider</th>
                      <th className="p-3.5">Purpose</th>
                      <th className="p-3.5">Retention</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-hairline">
                    {FUNCTIONAL_COOKIES.map((c) => (
                      <tr key={c.name} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                        <td className="p-3.5 font-mono font-bold text-brand-gold text-xs">{c.name}</td>
                        <td className="p-3.5 text-ink-muted text-xs">{c.provider}</td>
                        <td className="p-3.5 text-ink text-xs leading-relaxed">{c.purpose}</td>
                        <td className="p-3.5 text-ink-muted text-xs whitespace-nowrap">{c.retention}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Category 3 Table */}
            <div className="mt-10">
              <h3 className="text-xl font-bold text-ink mb-2">3.3 Performance &amp; Analytics Cookies</h3>
              <p className="text-sm text-ink-muted mb-4">
                These cookies provide aggregated telemetry, tracking navigation paths, search accuracy, and performance bottlenecks without identifying individual visitors.
              </p>
              <div className="overflow-x-auto rounded-2xl border border-hairline shadow-sm">
                <table className="w-full text-left text-sm">
                  <thead className="bg-surface-ivory dark:bg-white/5 border-b border-hairline font-mono text-xs uppercase text-ink">
                    <tr>
                      <th className="p-3.5">Cookie Name</th>
                      <th className="p-3.5">Provider</th>
                      <th className="p-3.5">Purpose</th>
                      <th className="p-3.5">Retention</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-hairline">
                    {ANALYTICS_COOKIES.map((c) => (
                      <tr key={c.name} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                        <td className="p-3.5 font-mono font-bold text-brand-gold text-xs">{c.name}</td>
                        <td className="p-3.5 text-ink-muted text-xs">{c.provider}</td>
                        <td className="p-3.5 text-ink text-xs leading-relaxed">{c.purpose}</td>
                        <td className="p-3.5 text-ink-muted text-xs whitespace-nowrap">{c.retention}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Category 4 Table */}
            <div className="mt-10">
              <h3 className="text-xl font-bold text-ink mb-2">3.4 Marketing &amp; Attribution Cookies</h3>
              <p className="text-sm text-ink-muted mb-4">
                Used to measure enterprise engagement with our industry reports and ensure our communications remain relevant to decision-makers.
              </p>
              <div className="overflow-x-auto rounded-2xl border border-hairline shadow-sm">
                <table className="w-full text-left text-sm">
                  <thead className="bg-surface-ivory dark:bg-white/5 border-b border-hairline font-mono text-xs uppercase text-ink">
                    <tr>
                      <th className="p-3.5">Cookie Name</th>
                      <th className="p-3.5">Provider</th>
                      <th className="p-3.5">Purpose</th>
                      <th className="p-3.5">Retention</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-hairline">
                    {MARKETING_COOKIES.map((c) => (
                      <tr key={c.name} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                        <td className="p-3.5 font-mono font-bold text-brand-gold text-xs">{c.name}</td>
                        <td className="p-3.5 text-ink-muted text-xs">{c.provider}</td>
                        <td className="p-3.5 text-ink text-xs leading-relaxed">{c.purpose}</td>
                        <td className="p-3.5 text-ink-muted text-xs whitespace-nowrap">{c.retention}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Section 4 */}
            <h2 className="text-2xl font-bold text-ink tracking-tight mt-12 mb-4">
              4. How to Manage and Disable Cookies
            </h2>
            <p className="text-body-base text-ink-muted leading-relaxed">
              Most web browsers automatically accept cookies by default. However, you have complete liberty to modify your browser settings to reject non-essential cookies, delete existing stored cookies, or notify you whenever a cookie is transmitted.
            </p>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-surface-ivory dark:bg-white/5 border border-hairline">
                <h4 className="font-bold text-ink text-sm">Google Chrome</h4>
                <p className="text-xs text-ink-muted mt-1">Settings &rarr; Privacy and security &rarr; Cookies and other site data</p>
              </div>
              <div className="p-4 rounded-xl bg-surface-ivory dark:bg-white/5 border border-hairline">
                <h4 className="font-bold text-ink text-sm">Mozilla Firefox</h4>
                <p className="text-xs text-ink-muted mt-1">Settings &rarr; Privacy &amp; Security &rarr; Enhanced Tracking Protection</p>
              </div>
              <div className="p-4 rounded-xl bg-surface-ivory dark:bg-white/5 border border-hairline">
                <h4 className="font-bold text-ink text-sm">Apple Safari</h4>
                <p className="text-xs text-ink-muted mt-1">Preferences &rarr; Privacy &rarr; Prevent cross-site tracking</p>
              </div>
              <div className="p-4 rounded-xl bg-surface-ivory dark:bg-white/5 border border-hairline">
                <h4 className="font-bold text-ink text-sm">Microsoft Edge</h4>
                <p className="text-xs text-ink-muted mt-1">Settings &rarr; Cookies and site permissions &rarr; Manage cookies</p>
              </div>
            </div>

            {/* Section 5 */}
            <h2 className="text-2xl font-bold text-ink tracking-tight mt-12 mb-4">
              5. Regional Legal Compliance &amp; Rights
            </h2>
            <div className="space-y-4 text-body-base text-ink-muted">
              <p>
                <strong>European Economic Area &amp; United Kingdom (GDPR):</strong> We do not deploy optional analytics or marketing cookies without your prior explicit consent. You may withdraw or alter your consent at any time via your browser or by contacting our data protection officer.
              </p>
              <p>
                <strong>California Consumers (CCPA/CPRA):</strong> We do not sell personal information or share personal information for cross-context behavioral advertising as defined under the California Consumer Privacy Act.
              </p>
            </div>

            {/* Section 6 */}
            <h2 className="text-2xl font-bold text-ink tracking-tight mt-12 mb-4">
              6. Updates to this Cookie Policy
            </h2>
            <p className="text-body-base text-ink-muted leading-relaxed">
              We may revise this Cookie Policy periodically to reflect technological advancements, operational enhancements, or statutory amendments. The updated date at the top of this document indicates when revisions were ratified.
            </p>

            {/* Section 7 */}
            <h2 className="text-2xl font-bold text-ink tracking-tight mt-12 mb-4">
              7. Contact Our Governance Team
            </h2>
            <p className="text-body-base text-ink-muted leading-relaxed">
              For any questions regarding our use of cookies or our data privacy practices, please contact our Data Protection Officer:
            </p>
            <div className="mt-4 p-6 rounded-2xl bg-surface-ivory dark:bg-white/5 border border-hairline space-y-2">
              <p className="text-sm font-bold text-ink">TeamBees Legal &amp; Data Governance</p>
              <p className="text-xs text-ink-muted">Email: <a href="mailto:privacy@teambees.com" className="text-brand-gold hover:underline">privacy@teambees.com</a></p>
              <p className="text-xs text-ink-muted">Headquarters: {siteConfig.contact.presence}</p>
              <p className="text-xs text-ink-muted">
                Related Policies: <Link href={routes.privacy()} className="text-brand-gold hover:underline">Privacy Policy</Link> &bull; <Link href={routes.terms()} className="text-brand-gold hover:underline">Terms &amp; Conditions</Link>
              </p>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
