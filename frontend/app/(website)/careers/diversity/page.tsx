import type { Metadata } from 'next';
import Link from 'next/link';
import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import PageHeader from '@/components/layout/PageHeader';
import { SectionHeading } from '@/components/sections/SectionHeading';
import { CTABand } from '@/components/sections/CTABand';
import { routes } from '@/config/routes';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: `Diversity, Equity & Inclusion Charter | Careers at ${siteConfig.name}`,
  description:
    'Our commitment to sovereign respect, blind meritocratic recruitment, global pay equity audits, and psychological safety across all seven TeamBees practices.',
  alternates: { canonical: `${siteConfig.url}${routes.careerDiversity()}` },
};

const DIVERSITY_PILLARS = [
  {
    tag: 'MERIT-FIRST RECRUITMENT',
    title: 'Blind Meritocratic Evaluation',
    description:
      'We remove candidate names, demographic identifiers, and elite school pedigree from initial technical evaluations. Shortlists are decided purely on demonstrable code quality, architectural depth, and problem-solving capability.',
  },
  {
    tag: 'GLOBAL PAY EQUITY',
    title: 'Audited Equal Compensation',
    description:
      'Every role is mapped to transparent market-benchmarked salary bands within each geographic region. We conduct annual independent third-party audits to guarantee zero unexplainable pay gaps across gender, race, or background.',
  },
  {
    tag: 'FOLLOW-THE-SUN RESPECT',
    title: 'Sovereign Time Zone Boundaries',
    description:
      'Our distributed pods operate across the Americas, Europe, Middle East, and Asia-Pacific. We enforce asynchronous communication norms, local public holiday recognition, and strict off-hours boundaries.',
  },
  {
    tag: 'BALANCED LEADERSHIP',
    title: 'Fast-Track Practice Leadership',
    description:
      'Diversity cannot exist only at junior tiers. We operate active sponsorship and leadership coaching programs designed to elevate underrepresented talent into Practice Leads and Solutions Architects.',
  },
  {
    tag: 'PSYCHOLOGICAL SAFETY',
    title: 'Zero-Tolerance Harassment Policy',
    description:
      'Safe reporting channels, independent ombudsperson escalation, and an uncompromised zero-tolerance policy protecting every team member from discrimination, harassment, or retaliation.',
  },
  {
    tag: 'INCLUSIVE WORKSPACES',
    title: 'Neurodiversity & Accessibility',
    description:
      'We provide adaptable tooling, quiet focus spaces at our regional delivery centers, and flexible communication preferences to support neurodivergent engineers and diverse working styles.',
  },
];

const ERG_GROUPS = [
  {
    name: 'Women in Enterprise Engineering',
    focus: 'Technical mentorship, architecture roundtables, and executive leadership pathways for female engineers.',
    stats: 'Monthly Roundtables &bull; 1-on-1 Mentorship',
  },
  {
    name: 'Neurodiversity & Focus Collective',
    focus: 'Community and resources advocating for sensory-friendly workstations, asynchronous collaboration, and cognitive diversity.',
    stats: 'Tooling Grants &bull; Flexible Cadences',
  },
  {
    name: 'Global Cultural Exchange',
    focus: 'Celebrating the traditions, festivals, and cultural heritage of our team members across USA, UK, UAE, India, and Singapore.',
    stats: 'Cross-Border Pod Swaps &bull; Cultural Holidays',
  },
];

export default function DiversityPage() {
  return (
    <>
      <PageHeader title="Diversity, Equity &amp; Inclusion" breadcrumb="Careers / Diversity" />

      <Section space="md">
        <Container>
          {/* Header */}
          <div className="max-w-3xl mb-12">
            <SectionHeading
              eyebrow="Sovereign Respect"
              title="Built on Merit, Strengthened by Diversity"
              description="In an enterprise technology collective solving high-consequence challenges, genuine inclusion is our highest operational priority. We build environments where world-class talent thrives with equal dignity."
            />
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href={`${routes.careers()}#open-roles`}
                className="px-5 py-2.5 rounded-xl bg-brand-navy text-white text-xs font-semibold hover:bg-brand-gold hover:text-brand-navy transition-colors shadow-sm"
              >
                Explore Open Roles &rarr;
              </Link>
              <Link
                href={routes.careerCandidateResources()}
                className="px-5 py-2.5 rounded-xl bg-surface-ivory dark:bg-white/5 border border-hairline text-ink text-xs font-semibold hover:border-brand-gold/50 transition-colors"
              >
                Candidate Interview Guide &rarr;
              </Link>
            </div>
          </div>

          {/* 1. Core Operating Principles */}
          <div className="mb-20">
            <div className="border-b border-hairline pb-4 mb-8">
              <span className="font-mono text-xs text-brand-gold font-semibold uppercase tracking-wider block">
                Charter Commitments
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight mt-1">
                Our Six Diversity &amp; Inclusion Pillars
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {DIVERSITY_PILLARS.map((pillar) => (
                <div
                  key={pillar.title}
                  className="p-7 rounded-3xl bg-white dark:bg-white/5 border border-hairline hover:border-brand-gold/40 transition-all shadow-sm flex flex-col justify-between"
                >
                  <div>
                    <span className="inline-block px-2.5 py-0.5 rounded bg-brand-navy/5 dark:bg-white/10 text-brand-navy dark:text-brand-gold font-mono text-[10px] font-semibold tracking-wider uppercase mb-3 border border-brand-gold/25">
                      {pillar.tag}
                    </span>
                    <h3 className="text-lg font-bold text-ink mb-2 tracking-tight">
                      {pillar.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-ink-muted leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 2. Employee Resource Groups (ERGs) */}
          <div className="mb-20">
            <div className="border-b border-hairline pb-4 mb-8">
              <span className="font-mono text-xs text-brand-gold font-semibold uppercase tracking-wider block">
                Community &amp; Belonging
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight mt-1">
                Employee Resource Groups (ERGs)
              </h2>
              <p className="text-sm text-ink-muted mt-1 max-w-2xl">
                Employee-led collectives that foster professional development, mentorship, and cross-cultural community across all seven practices.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {ERG_GROUPS.map((erg) => (
                <div
                  key={erg.name}
                  className="p-7 rounded-3xl bg-surface-ivory/60 dark:bg-white/5 border border-hairline shadow-sm flex flex-col justify-between"
                >
                  <div>
                    <h3 className="text-lg font-bold text-ink mb-2">{erg.name}</h3>
                    <p className="text-xs sm:text-sm text-ink-muted leading-relaxed mb-4">
                      {erg.focus}
                    </p>
                  </div>
                  <div className="pt-4 border-t border-hairline font-mono text-[11px] text-brand-gold">
                    {erg.stats}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Global Compliance & Equal Opportunity Statement */}
          <div className="mb-16 rounded-3xl bg-brand-navy text-white p-8 sm:p-12 border-2 border-brand-gold/40 shadow-xl relative overflow-hidden">
            <div className="max-w-3xl space-y-4">
              <span className="font-mono text-xs text-brand-gold font-semibold tracking-wider uppercase block">
                Formal EOE Statement &bull; Legal Compliance
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Equal Opportunity Employer (EOE) Pledge
              </h3>
              <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                TeamBees Corp provides equal employment opportunities to all employees and applicants for employment without regard to race, color, religion, sex, national origin, age, disability, genetics, sexual orientation, gender identity or expression, or veteran status.
              </p>
              <p className="text-sm text-gray-400 leading-relaxed">
                We strictly adhere to all applicable regional labor laws, including the US EEOC regulations, UK Equality Act 2010, UAE Federal Decree-Law on Employment Relations, Singapore TAFEP Fair Employment Guidelines, and Indian labor statutes.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      <CTABand
        title="Join our high-consequence delivery collective"
        description="Experience a culture grounded in psychological safety, meritocracy, and global pod collaboration."
      />
    </>
  );
}
