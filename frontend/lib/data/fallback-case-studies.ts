import type { CaseStudyDetail, CaseStudySummary } from '@/types/case-study';
import type { SeoBlock } from '@/types/seo';
import { routes } from '@/config/routes';

function makeSeo(title: string, desc: string): SeoBlock {
  return {
    meta_title: title,
    meta_description: desc,
    canonical_url: null,
    robots: 'index,follow',
    og_title: title,
    og_description: desc,
    og_image_url: null,
    twitter_card: 'summary_large_image',
    schema_type: 'Article',
    schema_json: null,
  };
}

export const FALLBACK_CASE_STUDIES: CaseStudyDetail[] = [
  {
    id: 1,
    slug: 'divo-multi-agent-finance-crm',
    title: '40% faster task execution, 45–60 minutes saved per user per day',
    template: 'case-study',
    href: routes.caseStudy('divo-multi-agent-finance-crm'),
    client: { name: 'Divo Financial' },
    summary:
      'A governed multi-agent LangGraph system resolves cross-domain queries across CRM and Finance without hallucinating or leaking data across roles.',
    challenge:
      'Sales and finance teams worked in parallel in Zoho CRM and Zoho Books. Queries crossed domains, and generic chatbots hallucinated and leaked data across roles.',
    solution:
      'AI Bees built a multi-agent system with episodic and semantic memory scoped per user, hallucinated tool calls intercepted by schema validation, and evals, mutation scoring and planted-bug checks run pre-release.',
    results:
      'Sales and finance teams now resolve cross-domain queries through one governed agent system, with faster execution and far fewer handling errors.',
    metrics: [
      { label: 'Faster task execution across ledger ops', value: '40%' },
      { label: 'Saved per user / day in high-volume teams', value: '45-60 m' },
      { label: 'Ledger reconcile accuracy with zero leaks', value: '99.9%' },
      { label: 'Production rollout with zero downtime', value: '14 Days' },
    ],
    how_it_works: [
      {
        step: 1,
        title: 'Discovery & Schema Scoping',
        description:
          'Deterministic mapping of 180+ custom SAP accounting tables to standard CRM ledger entities with zero ambiguous schema conversions.',
      },
      {
        step: 2,
        title: 'Guardrails & Security Protocol',
        description:
          'Enforced zero data leakage RBAC gateways, token obfuscation for PII data, and cryptographic signature generation for state changes.',
      },
      {
        step: 3,
        title: 'Agent Swarm Orchestration',
        description:
          'Multi-agent consensus implementation via LangGraph with fallback circuit breakers and episodic memory vector caching.',
      },
      {
        step: 4,
        title: 'Production Cutover & Monitoring',
        description:
          'Dark-launch shadowing for 72 hours, validation against 2.4M past reconciliations, followed by live zero-downtime cutover.',
      },
    ],
    capabilities_used: [
      'Agentic Architecture',
      'Memory & Retrieval',
      'Reliability & Governance',
      'Evaluation & Quality',
    ],
    published_at: '2024-10-15T00:00:00Z',
    practices: [
      {
        id: 1,
        slug: 'ai-bees',
        name: 'AI Bees',
        tagline: 'Production AI agents and LLM systems',
        summary: null,
        icon: null,
        color_token: '#6B4FA1',
        featured_image: null,
        href: routes.practice('ai-bees'),
      },
      {
        id: 2,
        slug: 'digital-bees',
        name: 'Digital Bees',
        tagline: 'Software engineering & cloud platforms',
        summary: null,
        icon: null,
        color_token: '#3F8FA5',
        featured_image: null,
        href: routes.practice('digital-bees'),
      },
    ],
    industries: [
      {
        id: 1,
        slug: 'banking-financial-services',
        name: 'Banking & Financial Services',
        summary: null,
        icon: null,
        href: routes.industry('banking-financial-services'),
      },
    ],
    technologies: [
      {
        id: 1,
        slug: 'gpt-4o',
        name: 'GPT-4o Enterprise',
        summary: null,
        vendor_name: 'OpenAI',
        href: routes.technology('gpt-4o'),
      },
      {
        id: 2,
        slug: 'langgraph',
        name: 'LangGraph',
        summary: null,
        vendor_name: 'LangChain',
        href: routes.technology('langgraph'),
      },
      {
        id: 3,
        slug: 'kafka',
        name: 'Apache Kafka',
        summary: null,
        vendor_name: 'Apache',
        href: routes.technology('kafka'),
      },
      {
        id: 4,
        slug: 'aws-eks',
        name: 'AWS EKS',
        summary: null,
        vendor_name: 'Amazon Web Services',
        href: routes.technology('aws-eks'),
      },
    ],
    regions: [
      { id: 1, slug: 'usa', name: 'USA', summary: null, iso_code: 'US', href: routes.region('usa') },
      { id: 2, slug: 'india', name: 'India', summary: null, iso_code: 'IN', href: routes.region('india') },
    ],
    hero: {
      eyebrow: 'Fintech & Banking',
      title: 'Multi-agent AI unifying Finance and CRM workflows',
      description:
        'A governed multi-agent LangGraph system resolves cross-domain queries across CRM and Finance without hallucinating or leaking data across roles.',
      cta: { label: 'Book an Architecture Consultation', url: routes.contact() },
    },
    seo: makeSeo(
      'Autonomous Financial Intelligence & CRM Orchestration | TeamBees',
      '40% faster task execution, 45-60 minutes saved per user per day through governed multi-agent AI systems.',
    ),
  },
  {
    id: 2,
    slug: 'hrms-ai-workforce-platform',
    title: 'AI workforce platform spanning 10 domains and 5 markets',
    template: 'case-study',
    href: routes.caseStudy('hrms-ai-workforce-platform'),
    client: { name: 'Multi-Market Enterprise' },
    summary:
      'Ten specialist AI agents run recruiting through workforce analytics across five markets, each scoped to its own jurisdiction employment law.',
    challenge:
      'Recruiting, HR, compliance and ops sat in separate tools across five markets, each with its own employment law. Generic AI assistants failed every compliance review.',
    solution:
      'Ten specialist AI agents, each scoped to its function and jurisdiction, with a human review gate on every employment-consequential output and an audit log on every model call across tenant-isolated client data.',
    results:
      'A single governed platform now runs recruiting through workforce analytics across five markets, with faster hiring and lower cost-per-hire.',
    metrics: [
      { label: 'Faster hiring cycles', value: '60%' },
      { label: 'Reduction in time-to-fill', value: '50%' },
      { label: 'Lower cost-per-hire', value: '30%' },
      { label: 'Saved per recruiter / day', value: '2 hrs' },
    ],
    how_it_works: [
      {
        step: 1,
        title: 'Recruiting & Sourcing',
        description:
          'Specialist agents handle recruiting, sourcing and screening within each market employment law.',
      },
      {
        step: 2,
        title: 'Compliance & Onboarding',
        description:
          'Compliance and onboarding agents apply jurisdiction-specific rules automatically.',
      },
      {
        step: 3,
        title: 'HR Operations & Payroll',
        description:
          'HR operations, payroll review and performance agents keep records consistent across markets.',
      },
      {
        step: 4,
        title: 'Learning & Workforce Analytics',
        description:
          'Learning & development and workforce analytics agents surface insight back to HR leadership.',
      },
    ],
    capabilities_used: ['Agentic Architecture', 'Reliability & Governance'],
    published_at: '2024-09-20T00:00:00Z',
    practices: [
      {
        id: 1,
        slug: 'ai-bees',
        name: 'AI Bees',
        tagline: 'Production AI agents and LLM systems',
        summary: null,
        icon: null,
        color_token: '#6B4FA1',
        featured_image: null,
        href: routes.practice('ai-bees'),
      },
      {
        id: 3,
        slug: 'talent-bees',
        name: 'Talent Bees',
        tagline: 'IT & specialist workforce solutions',
        summary: null,
        icon: null,
        color_token: '#4A6FA1',
        featured_image: null,
        href: routes.practice('talent-bees'),
      },
    ],
    industries: [
      {
        id: 2,
        slug: 'saas-technology',
        name: 'SaaS & Technology',
        summary: null,
        icon: null,
        href: routes.industry('saas-technology'),
      },
    ],
    technologies: [
      {
        id: 1,
        slug: 'claude-3-5',
        name: 'Claude 3.5 Sonnet',
        summary: null,
        vendor_name: 'Anthropic',
        href: routes.technology('claude'),
      },
      {
        id: 2,
        slug: 'fastapi',
        name: 'FastAPI',
        summary: null,
        vendor_name: 'FastAPI',
        href: routes.technology('fastapi'),
      },
    ],
    regions: [
      { id: 1, slug: 'usa', name: 'USA', summary: null, iso_code: 'US', href: routes.region('usa') },
      {
        id: 3,
        slug: 'singapore',
        name: 'Singapore',
        summary: null,
        iso_code: 'SG',
        href: routes.region('singapore'),
      },
    ],
    hero: {
      eyebrow: 'Enterprise HR Tech',
      title: 'AI workforce platform spanning 10 domains and 5 markets',
      description:
        'Ten specialist AI agents run recruiting through workforce analytics across five markets.',
      cta: { label: 'Book a Consultation', url: routes.contact() },
    },
    seo: makeSeo(
      'AI Workforce Platform Spanning 10 Domains | TeamBees',
      '60% faster hiring cycles with governed AI workforce systems.',
    ),
  },
  {
    id: 3,
    slug: 'servicenow-manufacturing-cmdb-csdm',
    title: 'CSDM-aligned CMDB across 20+ applications and hybrid datacenters',
    template: 'case-study',
    href: routes.caseStudy('servicenow-manufacturing-cmdb-csdm'),
    client: { name: 'Global Manufacturing Group' },
    summary:
      'A CSDM-aligned CMDB with Identification & Reconciliation Engine, health dashboards, and cloud discovery gave a global manufacturing and retail group a single trusted source of truth.',
    challenge:
      'Configuration data was fragmented across 20+ business applications and hybrid datacenters, with no single trusted source of truth for change and impact analysis.',
    solution:
      'ServiceNow Bees implemented a CSDM-aligned CMDB with IRE, health dashboards, and cloud discovery, extending OOTB structures only where customization earned its place.',
    results:
      'Change accuracy improved and the organization now operates from one trusted source of truth for its full application and infrastructure estate.',
    metrics: [
      { label: 'Better change accuracy', value: '35%' },
      { label: 'Custom fields moved to OOTB', value: '70%+' },
      { label: 'Trusted source of truth', value: '1' },
      { label: 'Hybrid discovery coverage', value: '100%' },
    ],
    how_it_works: [
      {
        step: 1,
        title: 'Architect',
        description: 'CSDM data model design across 20+ business applications and hybrid datacenters.',
      },
      {
        step: 2,
        title: 'Engineer',
        description:
          'CMDB, IRE, and cloud discovery configured and integrated with existing tooling.',
      },
      {
        step: 3,
        title: 'Assure',
        description: 'Data migration checks and reconciliation validation before go-live.',
      },
      {
        step: 4,
        title: 'Optimize',
        description: 'Health dashboards deployed for ongoing CMDB accuracy tracking.',
      },
    ],
    capabilities_used: ['Implementation', 'CMDB & CSDM', 'Governance'],
    published_at: '2024-08-10T00:00:00Z',
    practices: [
      {
        id: 4,
        slug: 'servicenow-bees',
        name: 'ServiceNow Bees',
        tagline: 'Elite ServiceNow engineering & architecture',
        summary: null,
        icon: null,
        color_token: '#2E6B4F',
        featured_image: null,
        href: routes.practice('servicenow-bees'),
      },
    ],
    industries: [
      {
        id: 3,
        slug: 'manufacturing-industrial',
        name: 'Manufacturing & Industrial',
        summary: null,
        icon: null,
        href: routes.industry('manufacturing-industrial'),
      },
    ],
    technologies: [
      {
        id: 5,
        slug: 'servicenow',
        name: 'ServiceNow Utah/Washington',
        summary: null,
        vendor_name: 'ServiceNow',
        href: '#',
      },
    ],
    regions: [{ id: 1, slug: 'usa', name: 'USA', summary: null, iso_code: 'US', href: routes.region('usa') }],
    hero: {
      eyebrow: 'Manufacturing & CSDM',
      title: 'CSDM-aligned CMDB across 20+ applications',
      description: 'Single trusted source of truth with 70%+ custom fields moved to OOTB.',
      cta: { label: 'Book a ServiceNow Assessment', url: routes.contact() },
    },
    seo: makeSeo(
      'Manufacturing CMDB Overhaul & CSDM Alignment | TeamBees',
      '70%+ legacy custom fields aligned to native ServiceNow OOTB.',
    ),
  },
  {
    id: 4,
    slug: 'utility-etrm-modernisation',
    title: 'Modernising trading and risk for an energy retailer',
    template: 'case-study',
    href: routes.caseStudy('utility-etrm-modernisation'),
    client: { name: 'Energy Retailer' },
    summary:
      'Energy Bees delivered an ETRM modernisation with forecasting data products for a fast-growing retailer.',
    challenge:
      'Spreadsheet-based risk processes could not keep up with portfolio growth and regulatory scrutiny.',
    solution:
      'ETRM build and integration, curve management, and load/price forecasting pipelines.',
    results: 'Position accuracy and reporting timeliness improved; manual effort reduced.',
    metrics: [
      { label: 'Close process reduction', value: '-3 days' },
      { label: 'Manual risk effort', value: '-50%' },
      { label: 'Ingestion pipeline latency', value: 'Sub-20ms' },
      { label: 'Forecasting accuracy gain', value: '+35%' },
    ],
    how_it_works: [
      {
        step: 1,
        title: 'Assessment',
        description: 'Trade support analysts mapped requirements against real desk workflows.',
      },
      {
        step: 2,
        title: 'ETRM Build & Integration',
        description:
          'Curve management and risk workflows configured and connected to market feeds.',
      },
      {
        step: 3,
        title: 'Forecasting Data Products',
        description: 'Load and price forecasting pipelines built to support trading decisions.',
      },
      {
        step: 4,
        title: 'Migration & Assurance',
        description: 'Test engineers ran regression and migration assurance through cutover.',
      },
    ],
    capabilities_used: ['Front, Middle & Back Office Coverage', 'Platform-Specific Delivery'],
    published_at: '2024-07-15T00:00:00Z',
    practices: [
      {
        id: 5,
        slug: 'energy-bees',
        name: 'Energy Bees',
        tagline: 'CTRM, ETRM & risk management systems',
        summary: null,
        icon: null,
        color_token: '#8A5A2E',
        featured_image: null,
        href: routes.practice('energy-bees'),
      },
    ],
    industries: [
      {
        id: 4,
        slug: 'energy-utilities',
        name: 'Energy & Utilities',
        summary: null,
        icon: null,
        href: routes.industry('energy-utilities'),
      },
    ],
    technologies: [
      {
        id: 6,
        slug: 'endur',
        name: 'OpenLink Endur',
        summary: null,
        vendor_name: 'OpenLink',
        href: '#',
      },
    ],
    regions: [{ id: 4, slug: 'uk', name: 'UK', summary: null, iso_code: 'GB', href: routes.region('uk') }],
    hero: {
      eyebrow: 'Energy & CTRM Trading',
      title: 'Modernising trading and risk for an energy retailer',
      description:
        'ETRM build, curve management, and load/price forecasting pipelines operating at sub-20ms latency.',
      cta: { label: 'Consult Energy Bees', url: routes.contact() },
    },
    seo: makeSeo(
      'ETRM Modernisation & Risk Pipelines | TeamBees',
      'Sub-20ms trading ingestion and -50% manual effort in risk reporting.',
    ),
  },
  {
    id: 5,
    slug: 'testbot-self-healing-ui-tests',
    title: 'AI-generated, self-healing UI tests for desktop apps',
    template: 'case-study',
    href: routes.caseStudy('testbot-self-healing-ui-tests'),
    client: { name: 'Desktop Software Team' },
    summary:
      'A local-first MCP server generates and self-heals autonomous regression tests for native QML/Qt and Windows apps, with zero cloud egress.',
    challenge:
      'Desktop teams shipping QML/Qt and Windows apps had no autonomous testing: cloud platforms refused native binaries, and regressions kept escaping to release.',
    solution:
      'A local-first MCP server running inside Claude Code generates tests from full source, not a lossy summary, commits them to git with stable IDs, and self-heals on UI churn — no data leaves the machine.',
    results:
      'Desktop QA teams ship autonomous, self-healing regression coverage without any cloud egress or credit meters.',
    metrics: [
      { label: 'Faster UI test authoring', value: '60-85%' },
      { label: 'Saved per QA engineer / day', value: '3-5 hrs' },
      { label: 'Faster time-to-green', value: '40-60%' },
      { label: 'Cloud egress or credit meters', value: 'Zero Defect' },
    ],
    how_it_works: [
      {
        step: 1,
        title: 'Discovery',
        description: 'The agent explores the application to map its screens and flows.',
      },
      {
        step: 2,
        title: 'Plan',
        description: 'A test plan is drafted against the discovered UI.',
      },
      {
        step: 3,
        title: 'Generate & Run',
        description: 'Tests are generated from full source and executed against the app.',
      },
      {
        step: 4,
        title: 'Heal & Score',
        description: 'Failing tests self-heal on UI churn and are scored for reliability.',
      },
    ],
    capabilities_used: ['Memory & Retrieval', 'Evaluation & Quality', 'Platform & Customization'],
    published_at: '2024-06-01T00:00:00Z',
    practices: [
      {
        id: 6,
        slug: 'quality-bees',
        name: 'Quality Bees',
        tagline: 'Continuous testing & quality engineering',
        summary: null,
        icon: null,
        color_token: '#4A8F6B',
        featured_image: null,
        href: routes.practice('quality-bees'),
      },
    ],
    industries: [
      {
        id: 2,
        slug: 'saas-technology',
        name: 'SaaS & Technology',
        summary: null,
        icon: null,
        href: routes.industry('saas-technology'),
      },
    ],
    technologies: [
      {
        id: 7,
        slug: 'mcp',
        name: 'Model Context Protocol',
        summary: null,
        vendor_name: 'Anthropic',
        href: '#',
      },
    ],
    regions: [{ id: 1, slug: 'usa', name: 'USA', summary: null, iso_code: 'US', href: routes.region('usa') }],
    hero: {
      eyebrow: 'Autonomous Quality Engineering',
      title: 'AI-generated, self-healing UI tests for desktop apps',
      description: 'Local-first MCP server with zero cloud egress and self-healing regression coverage.',
      cta: { label: 'Explore QA Engineering', url: routes.contact() },
    },
    seo: makeSeo(
      'Self-Healing UI Tests & Local-First MCP | TeamBees',
      '60-85% faster test authoring and 3-5 hours saved per QA engineer daily.',
    ),
  },
];

export function getFallbackCaseStudy(slug: string): CaseStudyDetail | null {
  return FALLBACK_CASE_STUDIES.find((c) => c.slug === slug) || null;
}

export function getFallbackCaseStudySummaries(): CaseStudySummary[] {
  return FALLBACK_CASE_STUDIES.map((c) => ({
    id: c.id,
    slug: c.slug,
    title: c.title,
    client_name: c.client?.name || null,
    summary: c.summary,
    metrics: c.metrics,
    published_at: c.published_at,
    href: c.href,
  }));
}
