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
  title: `Candidate Resources & Interview Guide | Careers at ${siteConfig.name}`,
  description:
    'Everything you need to know about joining TeamBees: our 5-gate placement evaluation rigor, practice-specific interview guides, benefits, and hiring FAQs.',
  alternates: { canonical: `${siteConfig.url}${routes.careerCandidateResources()}` },
};

const FIVE_GATES = [
  {
    number: '01',
    name: 'Profile & Experience Baseline',
    duration: '24-48 Hours',
    focus: 'Real Production Code & Portfolios',
    description:
      'We evaluate your real-world delivery track record, GitHub repositories, and past enterprise implementations rather than algorithmic trivia or buzzwords.',
    whatToExpect: 'Initial introductory discussion with a Talent Bees technical recruiter covering background, stack depth, and mutual fit.',
  },
  {
    number: '02',
    name: 'Structured Technical Assessment',
    duration: '60-90 Minutes',
    focus: 'Practical Architecture & Problem Solving',
    description:
      'Hands-on technical assessment tailored to your practice discipline (e.g. building an agentic tool-calling pipeline, refactoring a CSDM flow, or optimizing a trading database query).',
    whatToExpect: 'Collaborative pairing session with a senior engineer. We value clear reasoning, edge-case consideration, and code structure.',
  },
  {
    number: '03',
    name: 'Domain Depth & Pod Fit',
    duration: '45-60 Minutes',
    focus: 'Vertical Industry Context',
    description:
      'Evaluate how you apply engineering discipline inside real industry constraints: banking compliance, healthcare privacy, or commodities volatility.',
    whatToExpect: 'Conversation with a Practice Lead or Solutions Architect discussing architecture tradeoffs and high-consequence delivery.',
  },
  {
    number: '04',
    name: 'Client Consulting & Scenario Review',
    duration: '45 Minutes',
    focus: 'Communication, Autonomy & Leadership',
    description:
      'Assess how you articulate complex technical tradeoffs to non-technical stakeholders, navigate conflicting priorities, and collaborate inside autonomous pods.',
    whatToExpect: 'Interactive scenario review exploring production incidents, client expectation alignment, and pod delivery dynamics.',
  },
  {
    number: '05',
    name: 'Offer & Compliance Clearance',
    duration: '2-3 Business Days',
    focus: 'Seamless Sovereign Onboarding',
    description:
      'Transparent offer presentation with compensation benchmarking, regional compliance verification (W-2, IR35, or local employment contracts), and pod assignment.',
    whatToExpect: 'Formal offer letter, equipment provisioning choices, and structured 30/60/90 day integration milestones.',
  },
];

const PRACTICE_GUIDES = [
  {
    practice: 'AI Bees',
    badge: 'AGENTIC SWARMS & LLMOPS',
    focus: 'Multi-Agent Architectures, RAG & Deterministic Guardrails',
    tips: [
      'Be prepared to design supervisor/worker agent topologies with state checkpointing.',
      'Demonstrate how you prevent hallucinations at tool execution boundaries using typed JSON schemas.',
      'Familiarity with LangGraph, LangSmith evals, and vector databases (pgvector/Pinecone).',
    ],
  },
  {
    practice: 'ServiceNow Bees',
    badge: 'ENTERPRISE WORKFLOWS',
    focus: 'CSDM 4.0, Out-of-the-Box First & Instance Modernization',
    tips: [
      'Know the four domains of CSDM 4.0 and how business applications link to technical services.',
      'Experience constructing automated ATF test harnesses to safely validate platform upgrades.',
      'Platform certifications preferred: Certified System Administrator (CSA), CAD, or CIS.',
    ],
  },
  {
    practice: 'Digital Bees',
    badge: 'FULL-STACK & CLOUD',
    focus: 'Modern Microservices, Distributed Systems & Platform Engineering',
    tips: [
      'Clean architectural separation between API service layers, database models, and clients.',
      'Deep fluency in TypeScript/React, Python, Node.js, Go, or .NET with cloud infrastructure.',
      'Experience with Terraform, Docker/Kubernetes container orchestration, and CI/CD pipelines.',
    ],
  },
  {
    practice: 'Energy Bees',
    badge: 'CTRM / ETRM SYSTEMS',
    focus: 'Trading Systems (Endur, Allegro) & Real-Time Position Telemetry',
    tips: [
      'Understanding of front, middle, and back-office trade lifecycles across power, gas, or LNG.',
      'Hands-on experience with OpenLink Endur Connex, OpenComponents, or database interface scripts.',
      'Ability to communicate with trading desk analysts and understand risk curves.',
    ],
  },
  {
    practice: 'Quality Bees',
    badge: 'AUTOMATED QUALITY ASSURANCE',
    focus: 'Playwright, Contract Testing & Self-Healing Regression Suites',
    tips: [
      'Modern automated testing using Playwright or Cypress with robust auto-waiting strategies.',
      'Experience setting up API contract testing (Pact) and synthetic mutation testing.',
      'High-concurrency load and resilience testing using k6, JMeter, or Locust.',
    ],
  },
];

const CANDIDATE_FAQS = [
  {
    q: 'How quickly does the TeamBees hiring process move?',
    a: 'We respect your time. Our typical timeline from initial profile review to offer letter is 7 to 10 business days. You will receive structured feedback after every gate within 24 hours.',
  },
  {
    q: 'What is the pod delivery model, and how does it affect my daily work?',
    a: 'Rather than being an isolated contractor thrown onto a client ticket queue, you are part of a cohesive TeamBees pod led by a Practice Lead. Pods share knowledge, conduct internal architecture reviews, and maintain delivery SLAs collectively.',
  },
  {
    q: 'Can I work remotely or hybrid?',
    a: 'Yes. Most engineering and consulting roles offer flexible remote and hybrid pod arrangements across our global delivery zones in the USA, UK, UAE, India, and Singapore, with strict respect for local time zones.',
  },
  {
    q: 'Does TeamBees sponsor certifications and continuous learning?',
    a: '100%. We provide full financial sponsorship for verified platform credentials including AWS, Google Cloud, Microsoft Azure, ServiceNow Certified Master, and leading AI certifications.',
  },
  {
    q: 'What if there isn’t an open role matching my exact skill set today?',
    a: 'We are continuously vetting talent for upcoming enterprise engagements. You can submit your resume directly to our Talent Bees bench team for proactive matching when new client pods launch.',
  },
];

export default function CandidateResourcesPage() {
  return (
    <>
      <PageHeader title="Candidate Resources" breadcrumb="Careers / Candidate Resources" />

      <Section space="md">
        <Container>
          {/* Header */}
          <div className="max-w-3xl mb-12">
            <SectionHeading
              eyebrow="Talent Playbook"
              title="Your Guide to Joining TeamBees"
              description="Transparent expectations, technical preparation focus areas, and everything you need to know about our high-consequence delivery collective."
            />
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href={`${routes.careers()}#open-roles`}
                className="px-5 py-2.5 rounded-xl bg-brand-navy text-white text-xs font-semibold hover:bg-brand-gold hover:text-brand-navy transition-colors shadow-sm"
              >
                View Live Open Roles &rarr;
              </Link>
              <Link
                href={routes.careerDiversity()}
                className="px-5 py-2.5 rounded-xl bg-surface-ivory dark:bg-white/5 border border-hairline text-ink text-xs font-semibold hover:border-brand-gold/50 transition-colors"
              >
                Our Diversity &amp; Pay Equity Charter &rarr;
              </Link>
            </div>
          </div>

          {/* 1. The 5-Gate Placement Rigor */}
          <div className="mb-20">
            <div className="border-b border-hairline pb-4 mb-8">
              <span className="font-mono text-xs text-brand-gold font-semibold uppercase tracking-wider block">
                Structured Assessment
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight mt-1">
                The Five-Gate Technical Rigor
              </h2>
              <p className="text-sm text-ink-muted mt-1 max-w-2xl">
                We invest heavily in evaluating candidate capability before placement. Our 5-gate process ensures you are set up to lead and thrive from day one.
              </p>
            </div>

            <div className="space-y-4">
              {FIVE_GATES.map((gate) => (
                <div
                  key={gate.number}
                  className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-white/5 border border-hairline shadow-sm hover:border-brand-gold/40 transition-all"
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                    <div className="flex items-start gap-4">
                      <span className="font-mono text-2xl font-extrabold text-brand-gold">{gate.number}</span>
                      <div>
                        <h3 className="text-lg font-bold text-ink">{gate.name}</h3>
                        <span className="inline-block mt-1 font-mono text-[11px] text-brand-gold uppercase tracking-wider font-semibold">
                          Focus: {gate.focus}
                        </span>
                        <p className="mt-2 text-sm text-ink-muted leading-relaxed max-w-2xl">
                          {gate.description}
                        </p>
                        <div className="mt-3 p-3 rounded-xl bg-surface-ivory dark:bg-white/5 border border-hairline text-xs text-ink">
                          <span className="font-bold text-brand-gold">What to expect: </span>
                          {gate.whatToExpect}
                        </div>
                      </div>
                    </div>
                    <div className="md:text-right shrink-0">
                      <span className="inline-block px-3 py-1 rounded-full bg-surface-ivory dark:bg-white/10 font-mono text-xs text-ink-muted border border-hairline">
                        Typical turnaround: {gate.duration}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 2. Practice-Specific Interview Guides */}
          <div className="mb-20">
            <div className="border-b border-hairline pb-4 mb-8">
              <span className="font-mono text-xs text-brand-gold font-semibold uppercase tracking-wider block">
                Interview Prep Guides
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight mt-1">
                How to Prepare by Practice Discipline
              </h2>
              <p className="text-sm text-ink-muted mt-1 max-w-2xl">
                We test real engineering judgment, not memorized textbook trivia. Here is what our practice leads look for during interviews:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {PRACTICE_GUIDES.map((guide) => (
                <div
                  key={guide.practice}
                  className="p-6 rounded-3xl bg-surface-ivory/60 dark:bg-white/5 border border-hairline flex flex-col justify-between shadow-sm"
                >
                  <div>
                    <span className="inline-block px-2.5 py-0.5 rounded bg-brand-navy/5 dark:bg-white/10 text-brand-navy dark:text-brand-gold font-mono text-[10px] font-semibold tracking-wider uppercase mb-3 border border-brand-gold/25">
                      {guide.badge}
                    </span>
                    <h3 className="text-xl font-bold text-ink mb-1">{guide.practice}</h3>
                    <p className="text-xs font-mono text-brand-gold mb-4">{guide.focus}</p>

                    <div className="space-y-2.5">
                      {guide.tips.map((tip, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-ink-muted">
                          <span className="text-brand-gold font-bold">&bull;</span>
                          <span>{tip}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-hairline">
                    <Link
                      href={routes.practice(guide.practice.toLowerCase().replace(/\s+/g, '-'))}
                      className="text-xs font-semibold text-brand-gold hover:underline flex items-center justify-between"
                    >
                      <span>Explore {guide.practice} pod specs</span>
                      <span>&rarr;</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Candidate FAQs */}
          <div className="mb-16">
            <div className="border-b border-hairline pb-4 mb-8">
              <span className="font-mono text-xs text-brand-gold font-semibold uppercase tracking-wider block">
                Common Inquiries
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight mt-1">
                Frequently Asked Candidate Questions
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {CANDIDATE_FAQS.map((faq, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-white dark:bg-white/5 border border-hairline shadow-sm"
                >
                  <h3 className="text-base font-bold text-ink mb-2">{faq.q}</h3>
                  <p className="text-sm text-ink-muted leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      <CTABand
        title="Ready to engineer high-consequence systems?"
        description="Explore our open positions or connect directly with our global talent acquisition leads."
      />
    </>
  );
}
