import type { Metadata } from 'next';
import Link from 'next/link';
import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import PageHeader from '@/components/layout/PageHeader';
import { SectionHeading } from '@/components/sections/SectionHeading';
import { CTABand } from '@/components/sections/CTABand';
import { routes } from '@/config/routes';
import { siteConfig } from '@/config/site';
import { getPractices, getPractice } from '@/lib/api/practices';
import { getIndustries } from '@/lib/api/industries';
import { getRegions } from '@/lib/api/regions';
import { getTechnologies } from '@/lib/api/technologies';
import { getCaseStudies } from '@/lib/api/case-studies';
import { getInsights } from '@/lib/api/resources';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: `HTML Sitemap | Complete Directory | ${siteConfig.name}`,
  description:
    'Complete index of TeamBees practices, sub-services, industry hubs, regional delivery centers, enterprise case studies, and insights.',
  alternates: { canonical: `${siteConfig.url}${routes.sitemap()}` },
};

const COMPANY_PAGES = [
  { label: 'Home', href: routes.home(), desc: 'Enterprise engineering and technology collective' },
  { label: 'About Us / Our Story', href: routes.about(), desc: 'Founding mission, scale, and delivery DNA' },
  { label: 'Leadership', href: routes.companyLeadership(), desc: 'Practice leads, architects, and executive team' },
  { label: 'Partnerships & Certifications', href: routes.companyPartnerships(), desc: 'Technology, alliance, and platform tiers' },
  { label: 'Newsroom', href: routes.companyNewsroom(), desc: 'Press releases, media mentions, and announcements' },
  { label: 'ESG & Community', href: routes.companyEsg(), desc: 'Governance, environmental, and social responsibility' },
  { label: 'Careers (Life at TeamBees)', href: routes.careers(), desc: 'Open roles, engineering pods, and culture' },
  { label: 'Candidate Resources', href: routes.careerCandidateResources(), desc: '5-gate placement rigor and interview prep' },
  { label: 'Diversity, Equity & Inclusion', href: routes.careerDiversity(), desc: 'Global pay equity and inclusive hiring charter' },
  { label: 'How We Work', href: '/how-we-work', desc: 'Pod delivery model, SLAs, and engagement frameworks' },
  { label: 'Contact Us', href: routes.contact(), desc: 'Persona-routed enterprise inquiry routing' },
  { label: 'Site Search', href: routes.search(), desc: 'Full taxonomy and case study search' },
];

const LEGAL_PAGES = [
  { label: 'Privacy Policy', href: routes.privacy(), desc: 'Global data protection, GDPR and CCPA notices' },
  { label: 'Terms & Conditions', href: routes.terms(), desc: 'Platform usage terms and engagement governance' },
  { label: 'Cookie Policy', href: routes.cookies(), desc: 'Cookie categories, retention, and browser controls' },
];

export default async function SitemapPage() {
  const [practices, industries, regions, technologies, caseStudies, insights] = await Promise.all([
    getPractices().catch(() => []),
    getIndustries().catch(() => []),
    getRegions().catch(() => []),
    getTechnologies().catch(() => []),
    getCaseStudies().catch(() => []),
    getInsights(20).catch(() => ({ items: [], meta: {} })),
  ]);

  // Fetch sub-services for all practices in parallel
  const practicesWithServices = await Promise.all(
    practices.map(async (p) => {
      const detail = await getPractice(p.slug).catch(() => null);
      return {
        ...p,
        services: detail?.services || [],
      };
    }),
  );

  const quickNav = [
    { label: 'Core & Company', href: '#company' },
    { label: 'Practices & Services', href: '#practices' },
    { label: 'Industries', href: '#industries' },
    { label: 'Regions', href: '#regions' },
    { label: 'Case Studies', href: '#case-studies' },
    { label: 'Insights', href: '#insights' },
    { label: 'Technologies', href: '#technologies' },
    { label: 'Legal', href: '#legal' },
  ];

  return (
    <>
      <PageHeader title="HTML Sitemap" breadcrumb="Sitemap" />

      <Section space="md">
        <Container>
          <div className="max-w-3xl mb-10">
            <SectionHeading
              eyebrow="Directory Index"
              title="Explore the TeamBees Site Map"
              description="A structured overview of all public practices, sub-services, industry solutions, regional delivery centers, and enterprise insights."
            />

            {/* Quick-Jump Anchor Pills */}
            <div className="mt-8 flex flex-wrap gap-2">
              {quickNav.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="px-3 py-1.5 rounded-lg bg-surface-ivory dark:bg-white/5 border border-hairline text-xs font-semibold text-ink hover:border-brand-gold/60 hover:text-brand-gold transition-colors"
                >
                  {item.label} &darr;
                </a>
              ))}
            </div>
          </div>

          <div className="space-y-16">
            {/* 1. Core & Company Pages */}
            <section id="company" className="scroll-mt-24">
              <div className="flex items-center justify-between border-b border-hairline pb-4 mb-6">
                <h2 className="text-2xl font-bold text-ink tracking-tight">Core &amp; Company Pages</h2>
                <span className="font-mono text-xs text-ink-muted">{COMPANY_PAGES.length} pages</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {COMPANY_PAGES.map((page) => (
                  <Link
                    key={page.href}
                    href={page.href}
                    className="p-5 rounded-2xl bg-white dark:bg-white/5 border border-hairline hover:border-brand-gold/50 transition-all group shadow-sm hover:shadow-md"
                  >
                    <div className="font-bold text-ink group-hover:text-brand-gold transition-colors flex items-center justify-between">
                      <span>{page.label}</span>
                      <span className="text-xs text-brand-gold opacity-0 group-hover:opacity-100 transition-opacity">&rarr;</span>
                    </div>
                    <p className="mt-1.5 text-xs text-ink-muted leading-relaxed">{page.desc}</p>
                    <span className="mt-3 block font-mono text-[11px] text-ink-subtle">{page.href}</span>
                  </Link>
                ))}
              </div>
            </section>

            {/* 2. Practices & 44 Sub-Services */}
            <section id="practices" className="scroll-mt-24">
              <div className="flex items-center justify-between border-b border-hairline pb-4 mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-ink tracking-tight">Practices &amp; Specialized Services</h2>
                  <p className="text-sm text-ink-muted mt-1">7 Dedicated Engineering Pods with 44 Sub-Service Offerings</p>
                </div>
                <span className="font-mono text-xs text-ink-muted">{practices.length} Practices</span>
              </div>

              <div className="space-y-8">
                {practicesWithServices.map((practice) => (
                  <div
                    key={practice.slug}
                    className="rounded-3xl bg-surface-ivory/60 dark:bg-white/5 border border-hairline p-6 sm:p-8"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-hairline">
                      <div>
                        <span className="font-mono text-[11px] uppercase tracking-wider text-brand-gold font-semibold">
                          Practice Hub
                        </span>
                        <h3 className="text-xl font-extrabold text-ink mt-0.5">
                          <Link
                            href={routes.practice(practice.slug)}
                            className="hover:text-brand-gold transition-colors"
                          >
                            {practice.name} &rarr;
                          </Link>
                        </h3>
                        <p className="text-sm text-ink-muted mt-1 max-w-2xl">{practice.tagline || practice.summary}</p>
                      </div>
                      <Link
                        href={routes.practice(practice.slug)}
                        className="self-start sm:self-center px-4 py-2 rounded-xl bg-brand-navy dark:bg-white/10 text-white text-xs font-semibold hover:bg-brand-gold hover:text-brand-navy transition-colors whitespace-nowrap"
                      >
                        Explore Hub
                      </Link>
                    </div>

                    {practice.services.length > 0 && (
                      <div className="mt-6">
                        <span className="font-mono text-xs text-ink-muted font-semibold uppercase tracking-wider block mb-3">
                          Sub-Services ({practice.services.length})
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                          {practice.services.map((sub) => (
                            <Link
                              key={sub.slug}
                              href={routes.subService(practice.slug, sub.slug)}
                              className="p-3.5 rounded-xl bg-white dark:bg-white/5 border border-hairline hover:border-brand-gold/40 transition-colors group"
                            >
                              <div className="text-sm font-semibold text-ink group-hover:text-brand-gold transition-colors flex items-center justify-between">
                                <span>{sub.name}</span>
                                <span className="text-xs text-brand-gold opacity-0 group-hover:opacity-100 transition-opacity">&rarr;</span>
                              </div>
                              <span className="mt-1 block font-mono text-[10px] text-ink-subtle">
                                /practices/{practice.slug}/{sub.slug}
                              </span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* 3. Industries */}
            <section id="industries" className="scroll-mt-24">
              <div className="flex items-center justify-between border-b border-hairline pb-4 mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-ink tracking-tight">Industry Hubs</h2>
                  <p className="text-sm text-ink-muted mt-1">Domain-specific architectures and vertical compliance</p>
                </div>
                <span className="font-mono text-xs text-ink-muted">{industries.length} Industries</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {industries.map((ind) => (
                  <Link
                    key={ind.slug}
                    href={routes.industry(ind.slug)}
                    className="p-5 rounded-2xl bg-white dark:bg-white/5 border border-hairline hover:border-brand-gold/50 transition-all group shadow-sm hover:shadow-md"
                  >
                    <div className="font-bold text-ink group-hover:text-brand-gold transition-colors flex items-center justify-between">
                      <span>{ind.name}</span>
                      <span className="text-xs text-brand-gold opacity-0 group-hover:opacity-100 transition-opacity">&rarr;</span>
                    </div>
                    {ind.summary && <p className="mt-1.5 text-xs text-ink-muted line-clamp-2">{ind.summary}</p>}
                    <span className="mt-3 block font-mono text-[11px] text-ink-subtle">/industries/{ind.slug}</span>
                  </Link>
                ))}
              </div>
            </section>

            {/* 4. Regions */}
            <section id="regions" className="scroll-mt-24">
              <div className="flex items-center justify-between border-b border-hairline pb-4 mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-ink tracking-tight">Global Regions &amp; Delivery Hubs</h2>
                  <p className="text-sm text-ink-muted mt-1">Follow-the-sun execution across 4 continents</p>
                </div>
                <span className="font-mono text-xs text-ink-muted">{regions.length} Regions</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {regions.map((reg) => (
                  <Link
                    key={reg.slug}
                    href={routes.region(reg.slug)}
                    className="p-5 rounded-2xl bg-white dark:bg-white/5 border border-hairline hover:border-brand-gold/50 transition-all group text-center shadow-sm"
                  >
                    <span className="block text-lg font-bold text-ink group-hover:text-brand-gold transition-colors">
                      {reg.name}
                    </span>
                    <span className="mt-2 block font-mono text-[11px] text-ink-subtle">/regions/{reg.slug}</span>
                  </Link>
                ))}
              </div>
            </section>

            {/* 5. Case Studies */}
            <section id="case-studies" className="scroll-mt-24">
              <div className="flex items-center justify-between border-b border-hairline pb-4 mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-ink tracking-tight">Enterprise Case Studies</h2>
                  <p className="text-sm text-ink-muted mt-1">Verified production track record across banking, healthcare, and energy</p>
                </div>
                <Link
                  href={routes.caseStudies()}
                  className="text-xs font-semibold text-brand-gold hover:underline"
                >
                  View Case Study Library &rarr;
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {caseStudies.map((cs) => (
                  <Link
                    key={cs.slug}
                    href={routes.caseStudy(cs.slug)}
                    className="p-5 rounded-2xl bg-white dark:bg-white/5 border border-hairline hover:border-brand-gold/50 transition-all group shadow-sm hover:shadow-md"
                  >
                    <span className="font-mono text-[10px] text-brand-gold uppercase tracking-wider block mb-1">
                      {cs.client_name || 'Enterprise Proof'}
                    </span>
                    <h3 className="font-bold text-sm text-ink group-hover:text-brand-gold transition-colors">
                      {cs.title}
                    </h3>
                    {cs.summary && <p className="mt-2 text-xs text-ink-muted line-clamp-2">{cs.summary}</p>}
                    <span className="mt-3 block font-mono text-[11px] text-ink-subtle">/case-studies/{cs.slug}</span>
                  </Link>
                ))}
              </div>
            </section>

            {/* 6. Insights & Blog */}
            <section id="insights" className="scroll-mt-24">
              <div className="flex items-center justify-between border-b border-hairline pb-4 mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-ink tracking-tight">Insights &amp; Technical Perspectives</h2>
                  <p className="text-sm text-ink-muted mt-1">Points of view written by delivery leads and principal architects</p>
                </div>
                <Link
                  href={routes.insights()}
                  className="text-xs font-semibold text-brand-gold hover:underline"
                >
                  View All Insights &rarr;
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {insights.items.map((item) => (
                  <Link
                    key={item.slug}
                    href={routes.insight(item.slug)}
                    className="p-5 rounded-2xl bg-white dark:bg-white/5 border border-hairline hover:border-brand-gold/50 transition-all group shadow-sm hover:shadow-md"
                  >
                    <span className="font-mono text-[10px] text-brand-gold uppercase tracking-wider block mb-1">
                      {item.reading_time_minutes ? `${item.reading_time_minutes} min read` : 'Insight'}
                    </span>
                    <h3 className="font-bold text-sm text-ink group-hover:text-brand-gold transition-colors line-clamp-2">
                      {item.title}
                    </h3>
                    <span className="mt-3 block font-mono text-[11px] text-ink-subtle">/insights/{item.slug}</span>
                  </Link>
                ))}
              </div>
            </section>

            {/* 7. Technologies */}
            <section id="technologies" className="scroll-mt-24">
              <div className="flex items-center justify-between border-b border-hairline pb-4 mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-ink tracking-tight">Enterprise Technologies</h2>
                  <p className="text-sm text-ink-muted mt-1">Platform ecosystems, cloud engines, and frameworks</p>
                </div>
                <span className="font-mono text-xs text-ink-muted">{technologies.length} Technologies</span>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {technologies.map((tech) => (
                  <Link
                    key={tech.slug}
                    href={routes.technology(tech.slug)}
                    className="px-4 py-2 rounded-xl bg-white dark:bg-white/5 border border-hairline text-xs font-mono font-medium text-ink hover:border-brand-gold/50 hover:text-brand-gold transition-colors"
                  >
                    {tech.name}
                  </Link>
                ))}
              </div>
            </section>

            {/* 8. Legal & Governance */}
            <section id="legal" className="scroll-mt-24">
              <div className="flex items-center justify-between border-b border-hairline pb-4 mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-ink tracking-tight">Legal &amp; Compliance</h2>
                  <p className="text-sm text-ink-muted mt-1">Sovereign privacy, terms of engagement, and cookie governance</p>
                </div>
                <span className="font-mono text-xs text-ink-muted">{LEGAL_PAGES.length} policies</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {LEGAL_PAGES.map((policy) => (
                  <Link
                    key={policy.href}
                    href={policy.href}
                    className="p-5 rounded-2xl bg-white dark:bg-white/5 border border-hairline hover:border-brand-gold/50 transition-all group shadow-sm hover:shadow-md"
                  >
                    <div className="font-bold text-ink group-hover:text-brand-gold transition-colors flex items-center justify-between">
                      <span>{policy.label}</span>
                      <span className="text-xs text-brand-gold opacity-0 group-hover:opacity-100 transition-opacity">&rarr;</span>
                    </div>
                    <p className="mt-1.5 text-xs text-ink-muted leading-relaxed">{policy.desc}</p>
                    <span className="mt-3 block font-mono text-[11px] text-ink-subtle">{policy.href}</span>
                  </Link>
                ))}
              </div>
            </section>
          </div>
        </Container>
      </Section>

      <CTABand
        title="Looking for a specific engagement or practice?"
        description="Connect with our practice leads or let our enterprise routing team guide your evaluation."
      />
    </>
  );
}
