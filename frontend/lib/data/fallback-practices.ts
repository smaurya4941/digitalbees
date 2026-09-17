import type { PracticeDetail, PracticeSummary } from '@/types/practice';
import type { SeoBlock } from '@/types/seo';
import { routes } from '@/config/routes';
import { FALLBACK_CASE_STUDIES, getFallbackCaseStudySummaries } from './fallback-case-studies';

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
    schema_type: 'Service',
    schema_json: null,
  };
}

const allCaseSummaries = getFallbackCaseStudySummaries();

export const FALLBACK_PRACTICE_SUMMARIES: PracticeSummary[] = [
  {
    id: 1,
    slug: 'ai-bees',
    name: 'AI Bees',
    tagline: 'Autonomous multi-agent systems and production LLM engineering.',
    summary: 'Governed AI agents, LLMs, and intelligent automation built for enterprise workflows.',
    icon: 'smart_toy',
    color_token: '#6B4FA1',
    featured_image: null,
    href: routes.practice('ai-bees'),
    sub_services_count: 6,
  },
  {
    id: 2,
    slug: 'digital-bees',
    name: 'Digital Bees',
    tagline: 'Enterprise cloud platforms, modern APIs, and resilient data engineering.',
    summary: 'Software development, digital transformation, cloud engineering, and DevOps at scale.',
    icon: 'dataset',
    color_token: '#3F8FA5',
    featured_image: null,
    href: routes.practice('digital-bees'),
    sub_services_count: 7,
  },
  {
    id: 3,
    slug: 'talent-bees',
    name: 'Talent Bees',
    tagline: 'Hire elite engineering pods and specialized talent on your timeline.',
    summary: 'IT staffing, executive search, contract staffing, staff augmentation, and RPO across 6 regions.',
    icon: 'group',
    color_token: '#4A6FA1',
    featured_image: null,
    href: routes.practice('talent-bees'),
    sub_services_count: 6,
  },
  {
    id: 4,
    slug: 'marketing-bees',
    name: 'Marketing Bees',
    tagline: 'Full-funnel B2B demand generation, martech automation, and growth engineering.',
    summary: 'Digital marketing staff augmentation, SEO, PPC, marketing automation, and LinkedIn marketing.',
    icon: 'campaign',
    color_token: '#B8862B',
    featured_image: null,
    href: routes.practice('marketing-bees'),
    sub_services_count: 10,
  },
  {
    id: 5,
    slug: 'quality-bees',
    name: 'Quality Bees',
    tagline: 'Automated regression assurance, self-healing tests, and security engineering.',
    summary: 'Manual testing, automation testing, performance engineering, and AI testbots.',
    icon: 'verified',
    color_token: '#4A8F6B',
    featured_image: null,
    href: routes.practice('quality-bees'),
    sub_services_count: 5,
  },
  {
    id: 6,
    slug: 'servicenow-bees',
    name: 'ServiceNow Bees',
    tagline: 'Elite ServiceNow architecture, CSDM governance, and ITSM modernization.',
    summary: 'Consulting, development, implementation, support, and staff augmentation on the ServiceNow platform.',
    icon: 'settings_suggest',
    color_token: '#2E6B4F',
    featured_image: null,
    href: routes.practice('servicenow-bees'),
    sub_services_count: 5,
  },
  {
    id: 7,
    slug: 'energy-bees',
    name: 'Energy Bees',
    tagline: 'Trading and risk platforms (ETRM/CTRM), curve management, and low-latency data feeds.',
    summary: 'OpenLink Endur, Allegro, RightAngle, TriplePoint, and energy trading consulting.',
    icon: 'bolt',
    color_token: '#8A5A2E',
    featured_image: null,
    href: routes.practice('energy-bees'),
    sub_services_count: 5,
  },
];

export const FALLBACK_PRACTICE_DETAILS: Record<string, PracticeDetail> = {
  'ai-bees': {
    id: 1,
    slug: 'ai-bees',
    name: 'AI Bees',
    template: 'practice',
    href: routes.practice('ai-bees'),
    featured_image: null,
    hero: {
      eyebrow: 'Autonomous Enterprise Agents',
      title: 'From AI strategy to production in weeks, not quarters.',
      description:
        'We build, govern, and deploy autonomous multi-agent systems connected to your core enterprise ledgers and databases.',
      cta: { label: 'Book an Architecture Consultation', url: routes.contact() },
      secondary_cta: { label: 'Explore Divo Case Study', url: routes.caseStudy('divo-multi-agent-finance-crm') },
    },
    proof_points: [
      { value: '40%', label: 'Faster Task Execution' },
      { value: '45-60m', label: 'Saved Per Rep / Day' },
      { value: '99.9%', label: 'Deterministic Accuracy' },
      { value: '14 Days', label: 'Time-to-Production' },
    ],
    how_we_work: [
      { step: 1, title: 'Scoping & Safety Guardrails', description: 'Map schemas and establish strict RBAC and compliance filters.' },
      { step: 2, title: 'Agent Swarm Prototyping', description: 'Implement supervisor state machines and domain-specific specialists.' },
      { step: 3, title: 'Dark-Launch Shadowing', description: 'Run evaluations and mutation testing against past transaction histories.' },
      { step: 4, title: 'Production Cutover & Monitoring', description: 'Zero-downtime deployment with live telemetry and audit logging.' },
    ],
    services: [
      { id: 1, slug: 'ai-agents', name: 'AI Agents', summary: 'Multi-agent orchestration and LangGraph workflows.', href: routes.subService('ai-bees', 'ai-agents') },
      { id: 2, slug: 'generative-ai', name: 'Generative AI', summary: 'Fine-tuned LLMs and RAG knowledge retrieval systems.', href: routes.subService('ai-bees', 'generative-ai') },
      { id: 3, slug: 'llm-development', name: 'LLM Development', summary: 'Domain-adapted models with zero data leakage.', href: routes.subService('ai-bees', 'llm-development') },
      { id: 4, slug: 'ai-automation', name: 'AI Automation', summary: 'End-to-end autonomous business process automation.', href: routes.subService('ai-bees', 'ai-automation') },
      { id: 5, slug: 'ai-consulting', name: 'AI Consulting', summary: 'Enterprise AI readiness, feasibility, and architecture.', href: routes.subService('ai-bees', 'ai-consulting') },
      { id: 6, slug: 'ai-integration', name: 'AI Integration', summary: 'Seamless connectors into SAP, Salesforce, and Postgres.', href: routes.subService('ai-bees', 'ai-integration') },
    ],
    key_capabilities: [
      { title: 'Agentic Architecture', description: 'Hierarchical supervisors and autonomous tool use with circuit breakers.' },
      { title: 'Memory & Retrieval', description: 'Episodic and semantic vector retrieval with BM25 reranking.' },
      { title: 'Governance & Evals', description: 'Pre-commit evaluation benchmarks, mutation scoring, and deterministic audits.' },
      { title: 'Enterprise Isolation', description: 'Dedicated VPC model endpoints with zero public telemetry caching.' },
    ],
    industries: [
      { id: 1, slug: 'banking-financial-services', name: 'Banking & Financial Services', summary: null, icon: null, href: routes.industry('banking-financial-services') },
    ],
    technologies: [
      { id: 1, slug: 'gpt-4o', name: 'GPT-4o Enterprise', summary: null, vendor_name: 'OpenAI', href: routes.technology('gpt-4o') },
      { id: 2, slug: 'langgraph', name: 'LangGraph', summary: null, vendor_name: 'LangChain', href: routes.technology('langgraph') },
    ],
    regions: [
      { id: 1, slug: 'usa', name: 'USA', summary: null, iso_code: 'US', href: routes.region('usa') },
    ],
    case_studies: [
      allCaseSummaries.find((c) => c.slug === 'divo-multi-agent-finance-crm')!,
      allCaseSummaries.find((c) => c.slug === 'hrms-ai-workforce-platform')!,
    ].filter(Boolean),
    related_practices: [
      FALLBACK_PRACTICE_SUMMARIES[1], // Digital Bees
      FALLBACK_PRACTICE_SUMMARIES[4], // Quality Bees
    ],
    faqs: [
      { id: 1, question: 'How do you prevent hallucinations in financial workflows?', answer: 'We enforce deterministic state machines with schema-validated tool calling, fallback thresholds, and human-in-the-loop validation.' },
      { id: 2, question: 'What is the typical deployment timeline?', answer: 'Our standard delivery framework targets 14 business days from schema discovery to production cutover.' },
    ],
    seo: makeSeo('AI Bees | Production Enterprise AI & Autonomous Agents', 'Deploy governed multi-agent AI systems in weeks.'),
  },

  'digital-bees': {
    id: 2,
    slug: 'digital-bees',
    name: 'Digital Bees',
    template: 'practice',
    href: routes.practice('digital-bees'),
    featured_image: null,
    hero: {
      eyebrow: 'Cloud & Modern Engineering',
      title: 'Scalable cloud platforms and high-throughput data engineering.',
      description: 'Modernize legacy systems, automate CI/CD pipelines, and engineer resilient cloud architectures.',
      cta: { label: 'Talk to a Cloud Architect', url: routes.contact() },
    },
    proof_points: [
      { value: '8x', label: 'Release Frequency' },
      { value: '-27%', label: 'Infrastructure Cost' },
      { value: '99.99%', label: 'Platform Availability' },
      { value: '100%', label: 'Infrastructure-as-Code' },
    ],
    how_we_work: [
      { step: 1, title: 'Architecture Assessment', description: 'Analyze cloud spend, bottlenecks, and security posture.' },
      { step: 2, title: 'Strangler-Fig Migration', description: 'Extract monolithic services progressively behind event meshes.' },
      { step: 3, title: 'CI/CD & Observability', description: 'Automate build, testing, and unified distributed tracing.' },
      { step: 4, title: 'Reliability Engineering', description: 'Continuous load testing, chaos assurance, and zero-downtime cutover.' },
    ],
    services: [
      { id: 1, slug: 'software-development', name: 'Software Development', summary: 'Full-stack enterprise applications.', href: routes.subService('digital-bees', 'software-development') },
      { id: 2, slug: 'digital-transformation', name: 'Digital Transformation', summary: 'Modernizing legacy cores and databases.', href: routes.subService('digital-bees', 'digital-transformation') },
      { id: 3, slug: 'cloud-engineering', name: 'Cloud Engineering', summary: 'AWS, Azure, and Google Cloud platform delivery.', href: routes.subService('digital-bees', 'cloud-engineering') },
      { id: 4, slug: 'devops', name: 'DevOps & SRE', summary: 'Kubernetes orchestration and automated pipelines.', href: routes.subService('digital-bees', 'devops') },
      { id: 5, slug: 'product-engineering', name: 'Product Engineering', summary: 'Iterative agile sprints with senior pods.', href: routes.subService('digital-bees', 'product-engineering') },
      { id: 6, slug: 'ui-ux', name: 'UI/UX Design', summary: 'Design systems and accessible interfaces.', href: routes.subService('digital-bees', 'ui-ux') },
      { id: 7, slug: 'data-engineering', name: 'Data Engineering', summary: 'Streaming ingestion and analytical data warehouses.', href: routes.subService('digital-bees', 'data-engineering') },
    ],
    industries: [],
    technologies: [],
    regions: [],
    case_studies: [
      allCaseSummaries.find((c) => c.slug === 'divo-multi-agent-finance-crm')!,
    ].filter(Boolean),
    related_practices: [
      FALLBACK_PRACTICE_SUMMARIES[0], // AI Bees
      FALLBACK_PRACTICE_SUMMARIES[4], // Quality Bees
    ],
    faqs: [
      { id: 1, question: 'Do you work in existing client cloud accounts?', answer: 'Yes, our pods embed directly into your AWS, Azure, or GCP subscriptions adhering to your security controls.' },
    ],
    seo: makeSeo('Digital Bees | Cloud & Software Engineering', 'Enterprise cloud transformation and software engineering.'),
  },

  'talent-bees': {
    id: 3,
    slug: 'talent-bees',
    name: 'Talent Bees',
    template: 'practice',
    href: routes.practice('talent-bees'),
    featured_image: null,
    hero: {
      eyebrow: 'Specialized Engineering Pods',
      title: 'Hire vetted specialists you need, on your timeline.',
      description: 'IT and specialist staffing, executive search, contract staffing, staff augmentation, and RPO across 6 global regions.',
      cta: { label: 'Request Talent Profiles', url: routes.contact() },
    },
    proof_points: [
      { value: '2 Days', label: 'Shortlist Turnaround' },
      { value: '50+', label: 'Domain Experts' },
      { value: '6', label: 'Global Regions' },
      { value: '5', label: 'Technical Screening Gates' },
    ],
    how_we_work: [
      { step: 1, title: 'Role Scoping', description: 'Define exact technical requirements and budget.' },
      { step: 2, title: 'Rigorous Screening', description: 'Candidates pass hands-on code reviews and domain interviews.' },
      { step: 3, title: 'Rapid Onboarding', description: 'Contracts, compliance, and NDAs managed end-to-end.' },
      { step: 4, title: 'Ongoing Delivery Assurance', description: 'Regular check-ins to ensure team velocity and output.' },
    ],
    services: [
      { id: 1, slug: 'it-staffing', name: 'IT Staffing', summary: 'Senior software, cloud, and data engineers.', href: routes.subService('talent-bees', 'it-staffing') },
      { id: 2, slug: 'non-it-staffing', name: 'Non-IT Staffing', summary: 'Domain specialists and operational talent.', href: routes.subService('talent-bees', 'non-it-staffing') },
      { id: 3, slug: 'executive-search', name: 'Executive Search', summary: 'VP and Director-level technology leaders.', href: routes.subService('talent-bees', 'executive-search') },
      { id: 4, slug: 'contract-staffing', name: 'Contract Staffing', summary: 'Flexible project-based surge capacity.', href: routes.subService('talent-bees', 'contract-staffing') },
      { id: 5, slug: 'staff-augmentation', name: 'Staff Augmentation', summary: 'Embedded specialists inside your agile ceremonies.', href: routes.subService('talent-bees', 'staff-augmentation') },
      { id: 6, slug: 'rpo', name: 'RPO', summary: 'Recruitment process outsourcing for fast-growing teams.', href: routes.subService('talent-bees', 'rpo') },
    ],
    industries: [],
    technologies: [],
    regions: [],
    case_studies: [
      allCaseSummaries.find((c) => c.slug === 'hrms-ai-workforce-platform')!,
    ].filter(Boolean),
    related_practices: [
      FALLBACK_PRACTICE_SUMMARIES[0], // AI Bees
      FALLBACK_PRACTICE_SUMMARIES[1], // Digital Bees
    ],
    faqs: [
      { id: 1, question: 'How quickly can engineers start?', answer: 'Typical candidate shortlists are delivered within 48 hours, with cutover into client sprints in under a week.' },
    ],
    seo: makeSeo('Talent Bees | Engineering Staffing & Specialist Pods', 'Vetted technology talent and delivery pods.'),
  },

  'marketing-bees': {
    id: 4,
    slug: 'marketing-bees',
    name: 'Marketing Bees',
    template: 'practice',
    href: routes.practice('marketing-bees'),
    featured_image: null,
    hero: {
      eyebrow: 'B2B Growth & Performance',
      title: 'Full-funnel demand generation tied directly to closed pipeline.',
      description: 'Martech automation, closed-loop attribution, and multi-channel campaign delivery.',
      cta: { label: 'Consult Marketing Bees', url: routes.contact() },
    },
    proof_points: [
      { value: '+38%', label: 'Sourced Pipeline' },
      { value: '-22%', label: 'Cost Per Opportunity' },
      { value: '3.4x', label: 'Conversion Lift' },
      { value: '100%', label: 'Attribution Visibility' },
    ],
    how_we_work: [
      { step: 1, title: 'Audience & Funnel Audit', description: 'Analyze CRM conversion rates and acquisition channels.' },
      { step: 2, title: 'Martech Alignment', description: 'Unify HubSpot, LinkedIn, and CRM tracking architectures.' },
      { step: 3, title: 'Campaign Execution', description: 'Deploy content, account-based ads, and outbound nurturing.' },
      { step: 4, title: 'Pipeline Optimization', description: 'Continuous A/B testing and revenue attribution reporting.' },
    ],
    services: [
      { id: 1, slug: 'digital-marketing', name: 'Digital Marketing Staffing', summary: 'Dedicated growth marketers.', href: routes.subService('marketing-bees', 'digital-marketing') },
      { id: 2, slug: 'social-media', name: 'Social Media Teams', summary: 'Organic and paid B2B content.', href: routes.subService('marketing-bees', 'social-media') },
      { id: 3, slug: 'seo', name: 'SEO & Content', summary: 'High-intent search engine rankings.', href: routes.subService('marketing-bees', 'seo') },
      { id: 4, slug: 'ppc', name: 'PPC & Paid Acquisition', summary: 'Targeted B2B advertising campaigns.', href: routes.subService('marketing-bees', 'ppc') },
      { id: 5, slug: 'marketing-automation', name: 'Marketing Automation', summary: 'HubSpot and Marketo lifecycle flows.', href: routes.subService('marketing-bees', 'marketing-automation') },
    ],
    industries: [],
    technologies: [],
    regions: [],
    case_studies: [],
    related_practices: [
      FALLBACK_PRACTICE_SUMMARIES[2], // Talent Bees
      FALLBACK_PRACTICE_SUMMARIES[1], // Digital Bees
    ],
    faqs: [
      { id: 1, question: 'Which marketing platforms do you support?', answer: 'We specialize in HubSpot, Salesforce Marketing Cloud, Google Ads, LinkedIn Campaign Manager, and Marketo.' },
    ],
    seo: makeSeo('Marketing Bees | B2B Growth & Martech Engineering', 'Full-funnel demand generation connected to pipeline.'),
  },

  'quality-bees': {
    id: 5,
    slug: 'quality-bees',
    name: 'Quality Bees',
    template: 'practice',
    href: routes.practice('quality-bees'),
    featured_image: null,
    hero: {
      eyebrow: 'Continuous Quality & Assurance',
      title: 'Shift-left test automation, performance, and self-healing testbots.',
      description: 'Collapse regression cycles from weeks to hours with CI/CD embedded automation and MCP testing servers.',
      cta: { label: 'Explore QA Engineering', url: routes.contact() },
    },
    proof_points: [
      { value: '60-85%', label: 'Faster Test Authoring' },
      { value: '3-5h', label: 'Saved Per Engineer / Day' },
      { value: '-64%', label: 'Release Incidents' },
      { value: 'Zero', label: 'Cloud Egress in Local MCP' },
    ],
    how_we_work: [
      { step: 1, title: 'Test Strategy & Discovery', description: 'Map test surfaces, flaky suites, and release bottlenecks.' },
      { step: 2, title: 'Framework Architecture', description: 'Implement Playwright, Cypress, or local MCP testbots.' },
      { step: 3, title: 'Pipeline Integration', description: 'Embed automated gates into GitHub Actions or GitLab CI.' },
      { step: 4, title: 'Self-Healing & Observability', description: 'Maintain high test reliability with auto-remediation.' },
    ],
    services: [
      { id: 1, slug: 'manual-testing', name: 'Manual Testing', summary: 'Exploratory and accessibility testing.', href: routes.subService('quality-bees', 'manual-testing') },
      { id: 2, slug: 'automation-testing', name: 'Automation Testing', summary: 'End-to-end regression frameworks.', href: routes.subService('quality-bees', 'automation-testing') },
      { id: 3, slug: 'performance-testing', name: 'Performance Testing', summary: 'Load and stress testing with k6.', href: routes.subService('quality-bees', 'performance-testing') },
      { id: 4, slug: 'security-testing', name: 'Security Testing', summary: 'DAST, SAST, and vulnerability scans.', href: routes.subService('quality-bees', 'security-testing') },
      { id: 5, slug: 'ai-testing', name: 'AI Testbots', summary: 'Autonomous test generation from full source code.', href: routes.subService('quality-bees', 'ai-testing') },
    ],
    industries: [],
    technologies: [],
    regions: [],
    case_studies: [
      allCaseSummaries.find((c) => c.slug === 'testbot-self-healing-ui-tests')!,
    ].filter(Boolean),
    related_practices: [
      FALLBACK_PRACTICE_SUMMARIES[0], // AI Bees
      FALLBACK_PRACTICE_SUMMARIES[1], // Digital Bees
    ],
    faqs: [
      { id: 1, question: 'Do you test desktop and mobile apps?', answer: 'Yes, we provide test frameworks for native Windows/macOS applications, Qt/QML, React Native, iOS, and Android.' },
    ],
    seo: makeSeo('Quality Bees | Autonomous QA & Shift-Left Testing', 'Continuous test automation and self-healing testbots.'),
  },

  'servicenow-bees': {
    id: 6,
    slug: 'servicenow-bees',
    name: 'ServiceNow Bees',
    template: 'practice',
    href: routes.practice('servicenow-bees'),
    featured_image: null,
    hero: {
      eyebrow: 'Elite ServiceNow Partner',
      title: 'CSDM-aligned CMDB, ITSM, and HRSD digital workflows.',
      description: 'Streamline IT, employee, and customer operations with OOTB-first ServiceNow implementations and IRE reconciliation.',
      cta: { label: 'Book a ServiceNow Assessment', url: routes.contact() },
    },
    proof_points: [
      { value: '70%+', label: 'Custom Fields Moved to OOTB' },
      { value: '45%', label: 'Faster HR Case Resolution' },
      { value: '1', label: 'Trusted CMDB Source of Truth' },
      { value: '90 Days', label: 'Time to High Platform Adoption' },
    ],
    how_we_work: [
      { step: 1, title: 'Current-State Audit', description: 'Review custom table debt and CSDM compliance gaps.' },
      { step: 2, title: 'Architectural Blueprint', description: 'Design CSDM data model and upgrade-safe workflows.' },
      { step: 3, title: 'Agile Implementation', description: 'Deliver ServiceNow configurations in 2-week iterations.' },
      { step: 4, title: 'Reconciliation & AMS', description: 'Deploy health dashboards and managed application support.' },
    ],
    services: [
      { id: 1, slug: 'servicenow-consulting', name: 'ServiceNow Consulting', summary: 'Strategy and license optimization.', href: routes.subService('servicenow-bees', 'servicenow-consulting') },
      { id: 2, slug: 'servicenow-development', name: 'ServiceNow Development', summary: 'Custom apps and integration hub.', href: routes.subService('servicenow-bees', 'servicenow-development') },
      { id: 3, slug: 'servicenow-implementation', name: 'Implementation', summary: 'ITSM, ITOM, CMDB, and HRSD.', href: routes.subService('servicenow-bees', 'servicenow-implementation') },
      { id: 4, slug: 'servicenow-support', name: 'Support & AMS', summary: 'Continuous maintenance and upgrade assurance.', href: routes.subService('servicenow-bees', 'servicenow-support') },
      { id: 5, slug: 'servicenow-staffing', name: 'ServiceNow Staffing', summary: 'Certified administrators and architects.', href: routes.subService('servicenow-bees', 'servicenow-staffing') },
    ],
    industries: [],
    technologies: [],
    regions: [],
    case_studies: [
      allCaseSummaries.find((c) => c.slug === 'servicenow-manufacturing-cmdb-csdm')!,
    ].filter(Boolean),
    related_practices: [
      FALLBACK_PRACTICE_SUMMARIES[1], // Digital Bees
      FALLBACK_PRACTICE_SUMMARIES[2], // Talent Bees
    ],
    faqs: [
      { id: 1, question: 'Are your consultants certified?', answer: 'Yes, our team holds Certified System Administrator (CSA), Certified Implementation Specialist (CIS), and Master Architect certifications.' },
    ],
    seo: makeSeo('ServiceNow Bees | CSDM Governance & Enterprise Workflows', 'Elite ServiceNow implementation and CMDB alignment.'),
  },

  'energy-bees': {
    id: 7,
    slug: 'energy-bees',
    name: 'Energy Bees',
    template: 'practice',
    href: routes.practice('energy-bees'),
    featured_image: null,
    hero: {
      eyebrow: 'Commodity Trading & ETRM',
      title: 'Modern trading, risk, and forecasting data products.',
      description: 'Specialist consulting and software integration for OpenLink Endur, Allegro, RightAngle, and TriplePoint.',
      cta: { label: 'Consult Energy Bees', url: routes.contact() },
    },
    proof_points: [
      { value: 'Sub-20ms', label: 'Ingestion Latency' },
      { value: '-3 Days', label: 'Accounting Close Process' },
      { value: '-50%', label: 'Manual Risk Effort' },
      { value: '+35%', label: 'Forecasting Accuracy' },
    ],
    how_we_work: [
      { step: 1, title: 'Front/Middle/Back Office Scoping', description: 'Map trading desk workflows and regulatory needs.' },
      { step: 2, title: 'ETRM Build & Curve Pipelines', description: 'Configure position and risk data models.' },
      { step: 3, title: 'Data Products & Forecasting', description: 'Build predictive load, price, and weather forecasting.' },
      { step: 4, title: 'Regression & Cutover', description: 'Verify market feed settlement calculations before go-live.' },
    ],
    services: [
      { id: 1, slug: 'openlink-endur', name: 'OpenLink Endur', summary: 'Core trading and risk configuration.', href: routes.subService('energy-bees', 'openlink-endur') },
      { id: 2, slug: 'allegro', name: 'Allegro CTRM', summary: 'Power and gas trading workflows.', href: routes.subService('energy-bees', 'allegro') },
      { id: 3, slug: 'rightangle', name: 'RightAngle', summary: 'Refined products and liquids logistics.', href: routes.subService('energy-bees', 'rightangle') },
      { id: 4, slug: 'triplepoint', name: 'TriplePoint', summary: 'Commodity management architectures.', href: routes.subService('energy-bees', 'triplepoint') },
      { id: 5, slug: 'energy-consulting', name: 'Energy Trading Consulting', summary: 'Regulatory compliance and trade support.', href: routes.subService('energy-bees', 'energy-consulting') },
    ],
    industries: [],
    technologies: [],
    regions: [],
    case_studies: [
      allCaseSummaries.find((c) => c.slug === 'utility-etrm-modernisation')!,
    ].filter(Boolean),
    related_practices: [
      FALLBACK_PRACTICE_SUMMARIES[1], // Digital Bees
      FALLBACK_PRACTICE_SUMMARIES[4], // Quality Bees
    ],
    faqs: [
      { id: 1, question: 'Which asset classes do you cover?', answer: 'We cover power, natural gas, crude and refined products, LNG, carbon allowances, and agricultural commodities.' },
    ],
    seo: makeSeo('Energy Bees | ETRM, CTRM & Commodity Trading Systems', 'Specialist consulting for Endur, Allegro, and RightAngle.'),
  },
};

export function getFallbackPractice(slug: string): PracticeDetail | null {
  return FALLBACK_PRACTICE_DETAILS[slug] || null;
}

export function getFallbackPractices(): PracticeSummary[] {
  return FALLBACK_PRACTICE_SUMMARIES;
}
