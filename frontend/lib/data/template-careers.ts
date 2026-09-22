export interface TemplateRole {
  id: string;
  slug: string;
  title: string;
  practice: string;
  practice_slug: string;
  location: string;
  employment_type: string;
  tags: string[];
  description: string;
}

export interface EmployeeStory {
  id: string;
  name: string;
  role: string;
  practice: string;
  practice_slug: string;
  location: string;
  quote: string;
  photo_url: string;
  impact_tag: string;
}

export interface ValuePillar {
  number: string;
  title: string;
  tagline: string;
  description: string;
  badge: string;
}

export interface DniPillar {
  title: string;
  description: string;
  tag: string;
}

export const CORE_VALUES: ValuePillar[] = [
  {
    number: '01',
    title: 'High-Consequence Delivery',
    tagline: 'Engineering That Matters',
    description:
      'We solve mission-critical problems across banking, healthcare, and energy — not superficial wrappers. Every line of code impacts real enterprise operations and millions of transactions.',
    badge: 'MISSION-CRITICAL',
  },
  {
    number: '02',
    title: 'AI-Enabled, Human-Verified',
    tagline: 'Augmenting Human Ingenuity',
    description:
      'We empower our engineers with modern agentic workflows, deterministic guardrails, and enterprise tooling. Technology amplifies expertise, never replaces it.',
    badge: 'AGENTIC TOOLING',
  },
  {
    number: '03',
    title: 'Five-Gate Placement Rigor',
    tagline: 'Invested in Your Fit',
    description:
      'Profile Screen → Structured Assessment → Domain Validation → Communication Review → Checks & Readiness. We invest in getting your placement right and setting you up to lead.',
    badge: 'PLACEMENT QUALITY',
  },
  {
    number: '04',
    title: 'Global Mobility & Pod Ownership',
    tagline: 'Autonomous Multidisciplinary Pods',
    description:
      'Collaborate fluidly across delivery hubs in Gurugram, Chicago, Singapore, and Dubai. Move between high-impact engagements with dedicated pod autonomy.',
    badge: '4 CONTINENTS',
  },
];

export const EMPLOYEE_STORIES_TEMPLATE: EmployeeStory[] = [
  {
    id: 'story-1',
    name: 'Priya Sharma',
    role: 'Senior AI & Agentic Systems Engineer',
    practice: 'AI Bees',
    practice_slug: 'ai-bees',
    location: 'Gurugram ODC / Hybrid',
    quote:
      'At TeamBees, we aren’t just stitching together API wrappers. We engineer multi-agent swarms with strict RBAC guardrails for Fortune 100 banks. The technical rigor here is unmatched.',
    photo_url:
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    impact_tag: 'PRODUCTION AGENTIC SWARMS',
  },
  {
    id: 'story-2',
    name: 'Marcus Vance',
    role: 'CTRM Solutions Architect',
    practice: 'Energy Bees',
    practice_slug: 'energy-bees',
    location: 'Dubai DIFC / London',
    quote:
      'Operating in commodities and energy trading infrastructure requires sub-20ms precision. TeamBees gave me the pod support and autonomy to ship zero-downtime ledger synchronizations.',
    photo_url:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    impact_tag: 'COMMODITY TRADING SYSTEMS',
  },
  {
    id: 'story-3',
    name: 'Elena Rostova',
    role: 'ServiceNow Practice Lead',
    practice: 'ServiceNow Bees',
    practice_slug: 'servicenow-bees',
    location: 'Chicago / Remote',
    quote:
      'From custom CMDB modernization to automated incident orchestration, TeamBees backs you with certified master architects and zero bureaucratic drag.',
    photo_url:
      'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
    impact_tag: 'ENTERPRISE WORKFLOW TRANSFORMATION',
  },
];

export const DNI_PILLARS: DniPillar[] = [
  {
    title: 'Equal Opportunity Sourcing',
    description:
      'Blind technical assessments and merit-first evaluations ensuring objective global talent discovery free from demographic bias.',
    tag: 'MERIT-FIRST RECRUITMENT',
  },
  {
    title: 'Multi-Regional Capability Pods',
    description:
      'Distributed teams across 4 time zones operating with 24/7 follow-the-sun respect, cross-cultural collaboration, and psychological safety.',
    tag: 'FOLLOW-THE-SUN PODS',
  },
  {
    title: 'Balanced Leadership Pathways',
    description:
      'Targeted mentorship and fast-track practice lead succession programs designed to build diverse leadership across all seven Bees.',
    tag: 'LEADERSHIP SUCCESSION',
  },
];

export const TECH_STACK_BADGES = [
  'LangChain',
  'RAG Pipelines',
  'Claude 3.5 Sonnet',
  'GPT-4o',
  'Gemini Pro',
  'Agentic Swarms',
  'Automated Evals',
  'ServiceNow ITOM',
  'Kafka Streams',
  'Kubernetes',
];

export const FEATURED_ROLES_TEMPLATE: TemplateRole[] = [
  {
    id: 'role-1',
    slug: 'senior-ai-agentic-systems-engineer',
    title: 'Senior AI & Agentic Systems Engineer',
    practice: 'AI Bees',
    practice_slug: 'ai-bees',
    location: 'Remote / Hybrid (US or India)',
    employment_type: 'Full-time',
    tags: ['LangGraph', 'Python', 'SOC2 Guardrails'],
    description:
      'Design autonomous multi-agent swarms, RAG knowledge graph pipelines, and deterministic guardrail architectures for Fortune 500 financial institutions.',
  },
  {
    id: 'role-2',
    slug: 'principal-servicenow-architect',
    title: 'Principal ServiceNow Architect',
    practice: 'ServiceNow Bees',
    practice_slug: 'servicenow-bees',
    location: 'Singapore / Hybrid',
    employment_type: 'Full-time',
    tags: ['ITOM / ITSM', 'CMDB Overhaul', 'Certified Master'],
    description:
      'Lead enterprise ITOM, ITSM, and CSM modernizations, architectural governance, and custom digital workflow transformation across APAC enterprises.',
  },
  {
    id: 'role-3',
    slug: 'ctrm-etrm-systems-analyst',
    title: 'CTRM / ETRM Systems Analyst',
    practice: 'Energy Bees',
    practice_slug: 'energy-bees',
    location: 'Dubai / London',
    employment_type: 'Full-time',
    tags: ['Endur', 'RightAngle', 'Real-time Risk'],
    description:
      'Architect and support mission-critical commodity trading desks, trade capture pipelines, and real-time market risk telemetry.',
  },
  {
    id: 'role-4',
    slug: 'lead-automation-test-engineer',
    title: 'Lead Automation Test Engineer',
    practice: 'Quality Bees',
    practice_slug: 'quality-bees',
    location: 'India ODC (Gurugram)',
    employment_type: 'Full-time',
    tags: ['Playwright', 'Deterministic CI/CD', 'Zero-Defect QA'],
    description:
      'Scale automated continuous validation harnesses, performance regression suites, and regulatory testing protocols for medical device software.',
  },
];
