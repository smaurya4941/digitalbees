<?php

namespace Database\Seeders;

use App\Modules\Practice\Models\Capability;
use App\Modules\Practice\Models\Practice;
use App\Modules\Practice\Models\SubService;
use App\Modules\Practice\Models\Workflow;
use App\Support\Enums\ContentStatus;
use Illuminate\Database\Seeder;

/**
 * The seven practices and their sub-services — see
 * docs/architecture/information-architecture.md §3.1-3.2 and the TeamBees
 * Corp Website Design Blueprint §22 (per-practice sub-service lists) and
 * §22.4 (the AI Agents "what's included" worked example). Idempotent.
 */
class PracticeSeeder extends Seeder
{
    public function run(): void
    {
        foreach ($this->practices() as $order => $data) {
            $subServices = $data['sub_services'];
            unset($data['sub_services']);

            // `key_capabilities`/`workflow_steps` are normalized into their
            // own `capabilities`/`workflows` tables (not `practices`
            // columns) — extract before create, same as `sub_services`.
            $capabilities = $data['key_capabilities'] ?? [];
            $workflowSteps = $data['workflow_steps'] ?? [];
            unset($data['key_capabilities'], $data['workflow_steps']);

            $practice = Practice::updateOrCreate(
                ['slug' => $data['slug']],
                [...$data, 'sort_order' => $order, 'status' => ContentStatus::Published->value],
            );

            foreach ($subServices as $subOrder => $sub) {
                SubService::updateOrCreate(
                    ['practice_id' => $practice->id, 'slug' => $sub['slug']],
                    [
                        'name' => $sub['name'],
                        'summary' => $sub['summary'],
                        'whats_included' => $sub['whats_included'],
                        'sort_order' => $subOrder,
                        'status' => ContentStatus::Published->value,
                    ],
                );
            }

            foreach ($capabilities as $capOrder => $cap) {
                Capability::updateOrCreate(
                    ['practice_id' => $practice->id, 'title' => $cap['title']],
                    ['description' => $cap['description'] ?? null, 'sort_order' => $capOrder],
                );
            }

            foreach ($workflowSteps as $stepOrder => $step) {
                Workflow::updateOrCreate(
                    ['practice_id' => $practice->id, 'step' => $step['step']],
                    ['title' => $step['title'], 'description' => $step['description'] ?? null, 'sort_order' => $stepOrder],
                );
            }
        }
    }

    /** @return list<array<string, mixed>> */
    private function practices(): array
    {
        return [
            [
                'name' => 'Talent Bees',
                'slug' => 'talent-bees',
                'tagline' => 'Hire the specialists you need, on your timeline.',
                'summary' => 'IT and non-IT staffing, executive search, contract staffing, staff augmentation, and RPO across six global regions.',
                'icon' => 'users',
                'color_token' => 'practice-talent',
                'key_stats' => [
                    ['value' => '2 business days', 'label' => 'Typical shortlist turnaround'],
                    ['value' => '50+', 'label' => 'TA and domain experts'],
                    ['value' => '6', 'label' => 'Global regions'],
                    ['value' => '5', 'label' => 'Quality gates before you see a profile'],
                ],
                'key_capabilities' => [
                    ['title' => 'Surge Capacity', 'description' => 'Scale teams without adding permanent headcount.'],
                    ['title' => 'Domain Validation', 'description' => 'TA and domain experts verify fit before submission.'],
                    ['title' => 'Flexible Partner Model', 'description' => 'Work within client tools, processes and governance.'],
                    ['title' => 'One Onboarding Path', 'description' => 'Define → Match → Embed → Scale — start with one role, scale when ready.'],
                ],
                'sub_services' => [
                    [
                        'name' => 'IT Staffing',
                        'slug' => 'it-staffing',
                        'summary' => 'Vetted software, data, and platform engineers placed directly into your teams.',
                        'whats_included' => [
                            ['title' => 'Role scoping & market rate benchmarking', 'description' => 'We define the exact skill profile and a realistic hiring budget before sourcing starts.'],
                            ['title' => 'Pre-vetted technical shortlist', 'description' => 'Candidates are technically screened before you see a single resume.'],
                            ['title' => 'Compliant onboarding', 'description' => 'Contract, background check, and regional employment paperwork handled end to end.'],
                            ['title' => 'Post-placement check-ins', 'description' => 'Structured 30/60/90-day check-ins to catch integration issues early.'],
                        ],
                    ],
                    [
                        'name' => 'Non-IT Staffing',
                        'slug' => 'non-it-staffing',
                        'summary' => 'Operations, finance, and business-function talent for teams scaling alongside their technology.',
                        'whats_included' => [
                            ['title' => 'Business-function role scoping', 'description' => 'Operations, finance, HR, and project-management hiring specs.'],
                            ['title' => 'Pre-vetted shortlist', 'description' => 'Candidates screened for both skill fit and cultural fit.'],
                            ['title' => 'Compliant onboarding', 'description' => 'Contract and regional employment paperwork handled end to end.'],
                        ],
                    ],
                    [
                        'name' => 'Executive Search',
                        'slug' => 'executive-search',
                        'summary' => 'Leadership and hard-to-fill specialist hiring for roles that can\'t afford a mis-hire.',
                        'whats_included' => [
                            ['title' => 'Confidential search & mapping', 'description' => 'Discreet outreach to passive candidates who aren\'t on the open market.'],
                            ['title' => 'Structured leadership assessment', 'description' => 'Reference checks and structured interviews beyond a standard screen.'],
                            ['title' => 'Offer & negotiation support', 'description' => 'We manage the process through signed offer.'],
                        ],
                    ],
                    [
                        'name' => 'Contract Staffing',
                        'slug' => 'contract-staffing',
                        'summary' => 'Time-boxed specialists for a defined project window, without a permanent-hire commitment.',
                        'whats_included' => [
                            ['title' => 'Flexible contract lengths', 'description' => 'From a few weeks to multi-year engagements.'],
                            ['title' => 'Regional compliance built in', 'description' => 'IR35 (UK), W-2/1099/EOR (USA), and equivalent classification handled per region.'],
                            ['title' => 'Contract-to-hire conversion path', 'description' => 'Convert to permanent when the fit is proven.'],
                        ],
                    ],
                    [
                        'name' => 'Staff Augmentation',
                        'slug' => 'staff-augmentation',
                        'summary' => 'Specialists who plug into your stack, sprint cadence, and tooling from week one.',
                        'whats_included' => [
                            ['title' => 'Tooling & process handoff', 'description' => 'Specialists onboard into your existing sprint cadence and toolchain, not a parallel one.'],
                            ['title' => 'Bench visibility', 'description' => 'A live view of available skills so you can scale a team up or down quickly.'],
                            ['title' => 'Dedicated delivery point of contact', 'description' => 'One accountable owner for the augmented team, not a rotating cast.'],
                        ],
                    ],
                    [
                        'name' => 'RPO',
                        'slug' => 'rpo',
                        'summary' => 'Recruitment Process Outsourcing — we run all or part of your hiring function at volume.',
                        'whats_included' => [
                            ['title' => 'Embedded recruiting team', 'description' => 'A dedicated TeamBees recruiting function operating as an extension of yours.'],
                            ['title' => 'Employer-branded candidate experience', 'description' => 'Outreach and process run under your brand, not ours.'],
                            ['title' => 'Hiring analytics & reporting', 'description' => 'Time-to-fill, source-of-hire, and funnel conversion reporting.'],
                        ],
                    ],
                ],
            ],
            [
                'name' => 'Digital Bees',
                'slug' => 'digital-bees',
                'tagline' => 'Engineering that ships.',
                'summary' => 'Software development, digital transformation, cloud, DevOps, product engineering, UI/UX, and data engineering, delivered by teams that integrate into how you already work.',
                'icon' => 'layers',
                'color_token' => 'practice-digital',
                'key_stats' => [
                    ['value' => 'React · Node · Python · Java · .NET', 'label' => 'Core toolchain'],
                    ['value' => 'AWS · Azure · GCP', 'label' => 'Cloud platforms'],
                    ['value' => 'Kubernetes · Terraform', 'label' => 'Platform & DevOps'],
                    ['value' => '4', 'label' => 'Delivery models: Product, Platform, AI Enablement, Modernisation'],
                ],
                'key_capabilities' => [
                    ['title' => 'Full-Stack Engineers', 'description' => 'Web and service layers across modern stacks.'],
                    ['title' => 'Cloud & DevOps', 'description' => 'Cloud platforms, Kubernetes, Terraform and CI/CD.'],
                    ['title' => 'AI / ML Engineers', 'description' => 'LLMs, RAG, model training, MLOps and evaluation.'],
                    ['title' => 'QA & Test Automation', 'description' => 'UI, API, performance and automated testing.'],
                ],
                'sub_services' => [
                    [
                        'name' => 'Software Development',
                        'slug' => 'software-development',
                        'summary' => 'Full-cycle application engineering from architecture through production support.',
                        'whats_included' => [
                            ['title' => 'Architecture & technical design', 'description' => 'A design that matches your scale requirements, not an over-engineered default.'],
                            ['title' => 'Sprint-based delivery', 'description' => 'Regular demos and a visible backlog, integrated into your existing process.'],
                            ['title' => 'Test coverage & CI/CD', 'description' => 'Automated tests and a deploy pipeline shipped alongside the feature work, not after it.'],
                        ],
                    ],
                    [
                        'name' => 'Digital Transformation',
                        'slug' => 'digital-transformation',
                        'summary' => 'Modernizing how a business operates — process, systems, and org design together.',
                        'whats_included' => [
                            ['title' => 'Current-state assessment', 'description' => 'A clear map of where manual process and legacy systems are costing the business.'],
                            ['title' => 'Phased transformation roadmap', 'description' => 'Sequenced so value lands before the programme is fully complete.'],
                            ['title' => 'Change management support', 'description' => 'Training and rollout support so adoption doesn\'t stall after go-live.'],
                        ],
                    ],
                    [
                        'name' => 'Cloud Engineering',
                        'slug' => 'cloud-engineering',
                        'summary' => 'Migration, re-architecture, and FinOps across AWS, Azure, and GCP.',
                        'whats_included' => [
                            ['title' => 'Cloud readiness assessment', 'description' => 'A workload-by-workload migration plan, not a lift-and-shift by default.'],
                            ['title' => 'Infrastructure-as-code', 'description' => 'Reproducible environments, not console-configured infrastructure.'],
                            ['title' => 'Cost optimization (FinOps)', 'description' => 'Right-sizing and reserved-capacity review after migration, not just at launch.'],
                        ],
                    ],
                    [
                        'name' => 'DevOps',
                        'slug' => 'devops',
                        'summary' => 'CI/CD, observability, and platform engineering that shortens the path from commit to production.',
                        'whats_included' => [
                            ['title' => 'CI/CD pipeline design', 'description' => 'Automated build, test, and deploy across your environments.'],
                            ['title' => 'Observability & alerting', 'description' => 'Logging, metrics, and tracing wired in before an incident forces it.'],
                            ['title' => 'Infrastructure automation', 'description' => 'Terraform/equivalent-managed infrastructure, version-controlled like code.'],
                        ],
                    ],
                    [
                        'name' => 'Product Engineering',
                        'slug' => 'product-engineering',
                        'summary' => 'Full-cycle product pods: design, build, test, ship — for teams building product, not staffing tickets.',
                        'whats_included' => [
                            ['title' => 'Cross-functional pod', 'description' => 'Design, engineering, and QA working as one accountable unit.'],
                            ['title' => 'Discovery-to-delivery process', 'description' => 'Validated product decisions before a full build commitment.'],
                            ['title' => 'Roadmap ownership', 'description' => 'A pod that can own a roadmap, not just execute a backlog handed to it.'],
                        ],
                    ],
                    [
                        'name' => 'UI/UX',
                        'slug' => 'ui-ux',
                        'summary' => 'Interface and experience design grounded in real usage, not aesthetics alone.',
                        'whats_included' => [
                            ['title' => 'User research & usability testing', 'description' => 'Design decisions validated with real users before build.'],
                            ['title' => 'Design system creation', 'description' => 'A reusable component library so future screens ship faster and consistently.'],
                            ['title' => 'Accessibility built in', 'description' => 'WCAG 2.2 AA conformance considered from the first wireframe.'],
                        ],
                    ],
                    [
                        'name' => 'Data Engineering',
                        'slug' => 'data-engineering',
                        'summary' => 'Pipelines, APIs, and event backbones that make an organization\'s data usable.',
                        'whats_included' => [
                            ['title' => 'Pipeline architecture', 'description' => 'Batch and streaming pipelines designed for your actual data volume.'],
                            ['title' => 'Data quality & governance', 'description' => 'Validation and lineage so downstream teams can trust the numbers.'],
                            ['title' => 'Warehouse/lakehouse implementation', 'description' => 'A queryable data platform your analytics and AI initiatives can build on.'],
                        ],
                    ],
                ],
            ],
            [
                'name' => 'AI Bees',
                'slug' => 'ai-bees',
                'tagline' => 'From AI strategy to production, faster.',
                'summary' => 'AI agents, generative AI, LLM development, automation, consulting, and integration — built by teams who ship AI into real production systems, not just prototypes.',
                'icon' => 'sparkles',
                'color_token' => 'practice-ai',
                'key_stats' => [
                    ['value' => '2021', 'label' => 'Established'],
                    ['value' => '30+', 'label' => 'Workflows automated'],
                    ['value' => '78%', 'label' => 'Avg. processing-time reduction'],
                    ['value' => '4', 'label' => 'Markets'],
                ],
                'key_capabilities' => [
                    ['title' => 'Agentic Workflow Automation', 'description' => 'Agent-driven workflows with LLM reasoning, smart routing, and RAG pipelines.'],
                    ['title' => 'Intelligent Process Automation', 'description' => 'Automates documents, approvals, and integrations — cuts manual effort up to 78%.'],
                    ['title' => 'Enterprise System Integration', 'description' => 'API orchestration across Salesforce, NetSuite, SAP, Oracle, and payment systems.'],
                    ['title' => 'Governed & Compliant Execution', 'description' => 'Audit trails, RBAC, encryption, and high-availability SLAs.'],
                ],
                'workflow_steps' => [
                    ['step' => 1, 'title' => 'Data Ingestion & Signals', 'description' => 'PDFs, invoices, forms, APIs, and webhooks feed the pipeline.'],
                    ['step' => 2, 'title' => 'AI Reasoning & Validation', 'description' => 'OCR, LLM analysis, KYC/compliance checks, and task routing.'],
                    ['step' => 3, 'title' => 'Automated Execution', 'description' => 'ERP/CRM sync, approval routing, and payment processing.'],
                    ['step' => 4, 'title' => 'Monitoring & Optimization', 'description' => 'Dashboards, SLAs, audit trails, and continuous tuning.'],
                ],
                'framework_stack' => [
                    ['category' => 'LLM & Foundation Models', 'tools' => ['GPT-4', 'Claude', 'Gemini', 'LLaMA']],
                    ['category' => 'Agent Orchestration', 'tools' => ['LangChain', 'RAG Pipelines', 'Custom Agents']],
                    ['category' => 'Automation Platform', 'tools' => ['n8n', 'Make.com', 'UiPath', 'Zapier', 'Power Automate']],
                    ['category' => 'Cloud & Backend Runtime', 'tools' => ['Supabase', 'PostgreSQL', 'Node.js', 'Python', '.NET']],
                ],
                'agent_capabilities' => [
                    'AI agent design & orchestration for multi-step workflows',
                    'LLM reasoning pipelines with context-aware decision-making',
                    'RAG pipelines for domain-specific knowledge retrieval',
                    'Intelligent task routing across enterprise systems',
                    'Document processing automation (OCR + AI validation)',
                    'Governed execution with audit trails and role-based access',
                ],
                'technical_capabilities' => [
                    [
                        'title' => 'Agentic Architecture',
                        'points' => [
                            'Supervisor / worker & orchestrator / subagent patterns',
                            'Typed tool-calling schemas (JSON-locked)',
                            'Parallel agents with deterministic merge',
                            'Domain-scoped specialist agents',
                            'Checkpoint & resume',
                            'Idempotent workflows',
                        ],
                        'proven_in' => ['Divo', 'HRMS'],
                    ],
                    [
                        'title' => 'Memory & Retrieval',
                        'points' => [
                            'Episodic, semantic & procedural memory',
                            'Hybrid search (BM25 + dense)',
                            'Embeddings & reranking',
                            'Chunking & context-window management',
                            'Long-context retrieval',
                        ],
                        'proven_in' => ['Divo', 'Testbot'],
                    ],
                    [
                        'title' => 'Model & Prompt Engineering',
                        'points' => [
                            'System prompt design',
                            'Chain-of-thought & reasoning models',
                            'Structured output',
                            'Token efficiency',
                            'Streaming inference',
                            'Cost routing across models',
                        ],
                        'proven_in' => ['Divo', 'Testbot'],
                    ],
                    [
                        'title' => 'Reliability & Governance',
                        'points' => [
                            'Hallucination detection & tool-call interception',
                            'Loop detection & circuit breakers',
                            'Human-in-the-loop gates',
                            'RBAC & audit trail on every model call',
                            'PII redaction',
                            'LLM observability, LLMOps & AI gateway',
                            'Prompt versioning',
                        ],
                        'proven_in' => ['Divo', 'HRMS'],
                    ],
                    [
                        'title' => 'Evaluation & Quality',
                        'points' => [
                            'Evals frameworks (LangSmith, Braintrust)',
                            'Mutation scoring',
                            'Planted-bug validation',
                            'Self-healing AI-generated tests',
                            'Benchmarking & red-teaming',
                        ],
                        'proven_in' => ['Divo', 'Testbot'],
                    ],
                    [
                        'title' => 'Platform & Customization',
                        'points' => [
                            'Model Context Protocol (MCP)',
                            'Computer-use & multimodal agents',
                            'On-device / edge inference (ONNX)',
                            'Fine-tuning (LoRA / QLoRA) & RLHF',
                            'Domain-adapted models',
                            'Synthetic data generation',
                        ],
                        'proven_in' => ['Testbot'],
                    ],
                ],
                'servicenow_fit' => [
                    'delivery' => [
                        ['label' => 'Modules', 'items' => ['ITSM', 'HRSD', 'CSM', 'ITOM', 'CMDB & CSDM', 'ITAM / HAM', 'GRC / IRM']],
                        ['label' => 'Platform', 'items' => ['Flow Designer', 'IntegrationHub', 'UI Builder & Workspaces', 'Service Portal', 'ATF', 'Performance Analytics']],
                        ['label' => 'Integrations', 'items' => ['REST / SOAP', 'MID Server', 'OAuth 2.0 & mTLS', 'Import Sets & Transform Maps']],
                        ['label' => 'Delivery', 'items' => ['Upgrades', 'Update Sets & CI/CD', 'UAT', 'Production support & root-cause fixes']],
                    ],
                    'cards' => [
                        ['title' => 'Intelligent Triage & Routing', 'description' => 'AI classifies incidents, cases and HR requests and routes them to the right team — with RBAC and a full audit trail.'],
                        ['title' => 'Knowledge Answers with RAG', 'description' => 'Grounded answers from knowledge bases and policy documents for employee and agent self-service.'],
                        ['title' => 'Document Intake to Workflow', 'description' => 'OCR + AI validation turns forms, invoices and emails into catalog requests and records.'],
                        ['title' => 'AI-Driven Test Automation', 'description' => 'AI-generated, self-healing regression suites alongside ATF for upgrades and releases.'],
                    ],
                ],
                'sub_services' => [
                    [
                        'name' => 'AI Agents',
                        'slug' => 'ai-agents',
                        'summary' => 'AI agent development that goes into production, not just a demo.',
                        'whats_included' => [
                            ['title' => 'Use-case discovery & feasibility scoping', 'description' => 'We pressure-test whether a use case is worth building before we build it.'],
                            ['title' => 'Agent architecture & orchestration design', 'description' => 'A design that fits how the agent will actually be used and scaled.'],
                            ['title' => 'LLM selection & fine-tuning guidance', 'description' => 'The right model for the task and budget, not a default choice.'],
                            ['title' => 'Integration with existing systems', 'description' => 'CRM, ServiceNow, and data platforms — the agent works inside your stack, not beside it.'],
                            ['title' => 'Evaluation, guardrails, and monitoring', 'description' => 'Built in from the first sprint, not bolted on before launch.'],
                            ['title' => 'Post-launch iteration', 'description' => 'Ongoing tuning as real usage patterns emerge.'],
                        ],
                    ],
                    [
                        'name' => 'Generative AI',
                        'slug' => 'generative-ai',
                        'summary' => 'Content, code, and creative generation embedded into real workflows.',
                        'whats_included' => [
                            ['title' => 'Use-case & ROI assessment', 'description' => 'Where generative AI genuinely saves time versus where it adds review overhead.'],
                            ['title' => 'Prompt & workflow design', 'description' => 'Reliable, repeatable prompting patterns, not one-off experimentation.'],
                            ['title' => 'Human-in-the-loop review points', 'description' => 'Quality gates so generated output doesn\'t ship unreviewed.'],
                        ],
                    ],
                    [
                        'name' => 'LLM Development',
                        'slug' => 'llm-development',
                        'summary' => 'Custom LLM integration, fine-tuning, and evaluation for domain-specific use cases.',
                        'whats_included' => [
                            ['title' => 'Model selection & benchmarking', 'description' => 'Evaluated against your actual data and task, not generic leaderboards.'],
                            ['title' => 'Fine-tuning & RAG implementation', 'description' => 'Grounding responses in your content where accuracy matters most.'],
                            ['title' => 'Evaluation harness', 'description' => 'Repeatable quality scoring before and after every model change.'],
                        ],
                    ],
                    [
                        'name' => 'AI Automation',
                        'slug' => 'ai-automation',
                        'summary' => 'AI-augmented process automation for workflows too variable for traditional RPA.',
                        'whats_included' => [
                            ['title' => 'Process mining & candidate selection', 'description' => 'Identifying which workflows genuinely benefit from AI automation.'],
                            ['title' => 'Automation build & integration', 'description' => 'Wired into the systems the process already touches.'],
                            ['title' => 'Exception handling design', 'description' => 'A clear fallback to a human when the automation hits an edge case.'],
                        ],
                    ],
                    [
                        'name' => 'AI Consulting',
                        'slug' => 'ai-consulting',
                        'summary' => 'Strategy and roadmapping for organizations deciding where and how to invest in AI.',
                        'whats_included' => [
                            ['title' => 'AI maturity assessment', 'description' => 'An honest read of your data, tooling, and organizational readiness.'],
                            ['title' => 'Prioritized use-case roadmap', 'description' => 'Sequenced by feasibility and business impact, not novelty.'],
                            ['title' => 'Governance framework', 'description' => 'Policy and review processes so AI adoption scales safely.'],
                        ],
                    ],
                    [
                        'name' => 'AI Integration',
                        'slug' => 'ai-integration',
                        'summary' => 'Wiring AI capability into the systems a business already runs on.',
                        'whats_included' => [
                            ['title' => 'System & data integration', 'description' => 'Connecting AI capability to CRM, ERP, and internal data sources.'],
                            ['title' => 'API & middleware design', 'description' => 'A stable integration layer that survives model or vendor changes.'],
                            ['title' => 'Rollout & change management', 'description' => 'Training so teams actually adopt the new capability.'],
                        ],
                    ],
                ],
            ],
            [
                'name' => 'Marketing Bees',
                'slug' => 'marketing-bees',
                'tagline' => 'Marketing execution, on demand.',
                'summary' => 'Staff-augmented marketing teams and full-service delivery across SEO, PPC, content, design, video, automation, HubSpot, and LinkedIn.',
                'icon' => 'megaphone',
                'color_token' => 'practice-marketing',
                'key_stats' => [
                    ['value' => '9', 'label' => 'Marketing disciplines staffed'],
                    ['value' => 'HubSpot', 'label' => 'Certified admin & implementation'],
                    ['value' => 'T&M', 'label' => 'Flexible engagement model'],
                    ['value' => 'B2B', 'label' => 'Enterprise-focused execution'],
                ],
                'key_capabilities' => [
                    ['title' => 'Embedded Marketing Pods', 'description' => 'Specialists who plug into your existing team and tools from day one.'],
                    ['title' => 'Full-Funnel Execution', 'description' => 'SEO, PPC, content, design, video and automation under one accountable team.'],
                    ['title' => 'HubSpot & Lifecycle Automation', 'description' => 'Implementation, migration, lead scoring and nurture-sequence design.'],
                    ['title' => 'B2B LinkedIn Strategy', 'description' => 'Organic and paid LinkedIn programmes built for enterprise decision-makers.'],
                ],
                'sub_services' => [
                    [
                        'name' => 'Digital Marketing Staff Augmentation',
                        'slug' => 'digital-marketing-staff-augmentation',
                        'summary' => 'Embedded marketing specialists who plug into your existing team and tools.',
                        'whats_included' => [
                            ['title' => 'Role scoping across marketing disciplines', 'description' => 'From a single specialist to a full embedded pod.'],
                            ['title' => 'Tooling handoff', 'description' => 'Specialists work inside your existing marketing stack from day one.'],
                            ['title' => 'Flexible scaling', 'description' => 'Scale the team up for a campaign push, down between them.'],
                        ],
                    ],
                    [
                        'name' => 'Social Media Teams',
                        'slug' => 'social-media-teams',
                        'summary' => 'Dedicated social content, community management, and paid social execution.',
                        'whats_included' => [
                            ['title' => 'Content calendar & production', 'description' => 'Planned, on-brand content across the channels that matter to your audience.'],
                            ['title' => 'Community management', 'description' => 'Timely, on-voice responses that protect brand reputation.'],
                            ['title' => 'Paid social campaign management', 'description' => 'Budget management and creative testing across platforms.'],
                        ],
                    ],
                    [
                        'name' => 'SEO',
                        'slug' => 'seo',
                        'summary' => 'Technical SEO, content strategy, and organic growth for search-driven pipelines.',
                        'whats_included' => [
                            ['title' => 'Technical SEO audit', 'description' => 'Crawlability, Core Web Vitals, and indexation issues identified and fixed.'],
                            ['title' => 'Keyword & content strategy', 'description' => 'A content plan mapped to real search intent and business priority.'],
                            ['title' => 'Ongoing rank & traffic reporting', 'description' => 'Monthly reporting tied to organic sessions and lead generation.'],
                        ],
                    ],
                    [
                        'name' => 'PPC',
                        'slug' => 'ppc',
                        'summary' => 'Paid search and paid social campaign management focused on cost-efficient pipeline.',
                        'whats_included' => [
                            ['title' => 'Campaign strategy & setup', 'description' => 'Structured for measurable cost-per-lead, not just impressions.'],
                            ['title' => 'Ongoing bid & budget optimization', 'description' => 'Active management, not a set-and-forget campaign.'],
                            ['title' => 'Conversion tracking & attribution', 'description' => 'Spend tied to actual pipeline, not vanity clicks.'],
                        ],
                    ],
                    [
                        'name' => 'Content Marketing',
                        'slug' => 'content-marketing',
                        'summary' => 'Long-form and campaign content built to support both SEO and sales enablement.',
                        'whats_included' => [
                            ['title' => 'Editorial calendar & briefs', 'description' => 'Content mapped to funnel stage and search intent.'],
                            ['title' => 'Writing & production', 'description' => 'On-brand, subject-matter-credible content, not generic filler.'],
                            ['title' => 'Distribution & repurposing', 'description' => 'One piece of content produced once and reused across channels.'],
                        ],
                    ],
                    [
                        'name' => 'Graphic Design',
                        'slug' => 'graphic-design',
                        'summary' => 'Brand-consistent visual design for campaigns, web, and sales collateral.',
                        'whats_included' => [
                            ['title' => 'Brand-consistent asset production', 'description' => 'Design that matches an existing brand system, not a one-off style.'],
                            ['title' => 'Campaign & web creative', 'description' => 'Assets sized and optimized for the channels they\'ll run on.'],
                            ['title' => 'Sales collateral design', 'description' => 'One-pagers and decks that support the sales team directly.'],
                        ],
                    ],
                    [
                        'name' => 'Video Editing',
                        'slug' => 'video-editing',
                        'summary' => 'Video production and editing for campaigns, testimonials, and social content.',
                        'whats_included' => [
                            ['title' => 'Editing & post-production', 'description' => 'Raw footage turned into channel-ready video.'],
                            ['title' => 'Motion graphics & captions', 'description' => 'Accessible, scroll-stopping video for social-first audiences.'],
                            ['title' => 'Multi-format delivery', 'description' => 'Cut for the aspect ratio and length each platform actually needs.'],
                        ],
                    ],
                    [
                        'name' => 'Marketing Automation',
                        'slug' => 'marketing-automation',
                        'summary' => 'Lifecycle automation, lead scoring, and nurture-sequence implementation.',
                        'whats_included' => [
                            ['title' => 'Automation platform implementation', 'description' => 'Workflows built for your actual funnel, not a generic template.'],
                            ['title' => 'Lead scoring & routing setup', 'description' => 'Leads reach the right owner with the right context automatically.'],
                            ['title' => 'Nurture sequence design', 'description' => 'Sequences that move a lead forward, not a blast to everyone.'],
                        ],
                    ],
                    [
                        'name' => 'HubSpot',
                        'slug' => 'hubspot',
                        'summary' => 'HubSpot implementation, migration, and ongoing administration.',
                        'whats_included' => [
                            ['title' => 'Implementation or migration', 'description' => 'Clean data migration from a legacy CRM or a from-scratch build.'],
                            ['title' => 'Workflow & reporting setup', 'description' => 'Dashboards and automations built around how your team actually sells and markets.'],
                            ['title' => 'Ongoing admin & optimization', 'description' => 'Continued tuning as your process and team evolve.'],
                        ],
                    ],
                    [
                        'name' => 'LinkedIn Marketing',
                        'slug' => 'linkedin-marketing',
                        'summary' => 'B2B-focused LinkedIn organic and paid strategy for enterprise audiences.',
                        'whats_included' => [
                            ['title' => 'Organic content strategy', 'description' => 'Thought-leadership content built for a B2B decision-maker audience.'],
                            ['title' => 'Paid campaign management', 'description' => 'Sponsored content and InMail campaigns targeted by role and company.'],
                            ['title' => 'Executive ghostwriting support', 'description' => 'Leadership visibility content that builds credibility with buyers.'],
                        ],
                    ],
                ],
            ],
            [
                'name' => 'Quality Bees',
                'slug' => 'quality-bees',
                'tagline' => 'Ship with confidence.',
                'summary' => 'Manual, automation, performance, security, and AI testing that catches what matters before your customers do.',
                'icon' => 'shield-check',
                'color_token' => 'practice-quality',
                'key_stats' => [
                    ['value' => 'Selenium · Cypress · Playwright', 'label' => 'Automation frameworks'],
                    ['value' => 'JMeter · LoadRunner · K6', 'label' => 'Performance tooling'],
                    ['value' => 'OWASP ZAP · Burp Suite', 'label' => 'Security testing tooling'],
                    ['value' => 'WCAG 2.1', 'label' => 'Accessibility conformance'],
                ],
                'key_capabilities' => [
                    ['title' => 'End-to-End Validation', 'description' => 'Verification of user flows and requirements integrity across the entire application lifecycle.'],
                    ['title' => 'Performance & Load Testing', 'description' => 'High-concurrency simulation to validate system stability under peak loads.'],
                    ['title' => 'Security (DAST / SAST)', 'description' => 'Vulnerability scanning and penetration testing to protect critical assets.'],
                    ['title' => 'Accessibility (WCAG 2.1)', 'description' => 'Ensuring compliance with global accessibility standards for inclusive design.'],
                ],
                'sub_services' => [
                    [
                        'name' => 'Manual Testing',
                        'slug' => 'manual-testing',
                        'summary' => 'Exploratory and structured manual testing where automation isn\'t yet the right tool.',
                        'whats_included' => [
                            ['title' => 'Test case design', 'description' => 'Scenarios grounded in real user behavior, not just the happy path.'],
                            ['title' => 'Exploratory testing sessions', 'description' => 'Structured exploration that catches issues scripted tests miss.'],
                            ['title' => 'Defect triage & reporting', 'description' => 'Prioritized by real user impact, not just count.'],
                        ],
                    ],
                    [
                        'name' => 'Automation Testing',
                        'slug' => 'automation-testing',
                        'summary' => 'Test automation framework design and CI-integrated regression suites.',
                        'whats_included' => [
                            ['title' => 'Framework design', 'description' => 'Built to fit your stack and team\'s maintenance capacity, not an over-engineered default.'],
                            ['title' => 'CI/CD integration', 'description' => 'Tests run automatically on every build, not as an afterthought.'],
                            ['title' => 'Ongoing suite maintenance', 'description' => 'Flaky-test triage so the suite stays trusted, not ignored.'],
                        ],
                    ],
                    [
                        'name' => 'Performance Testing',
                        'slug' => 'performance-testing',
                        'summary' => 'Load, stress, and resilience testing so systems hold up under real demand.',
                        'whats_included' => [
                            ['title' => 'Load & stress test design', 'description' => 'Scenarios modeled on your actual peak-traffic patterns.'],
                            ['title' => 'Bottleneck analysis', 'description' => 'Root-cause identification, not just a pass/fail report.'],
                            ['title' => 'Capacity planning recommendations', 'description' => 'Concrete guidance on what to scale before the next peak.'],
                        ],
                    ],
                    [
                        'name' => 'Security Testing',
                        'slug' => 'security-testing',
                        'summary' => 'Application security testing to catch vulnerabilities before release.',
                        'whats_included' => [
                            ['title' => 'Vulnerability assessment', 'description' => 'OWASP-aligned testing across the application surface.'],
                            ['title' => 'Penetration testing', 'description' => 'Real-world exploit attempts, not just an automated scan.'],
                            ['title' => 'Remediation guidance', 'description' => 'Prioritized fixes, not just a list of findings.'],
                        ],
                    ],
                    [
                        'name' => 'AI Testing',
                        'slug' => 'ai-testing',
                        'summary' => 'Testing that catches what generic QA misses in AI and LLM-powered systems.',
                        'whats_included' => [
                            ['title' => 'Model evaluation & benchmarking', 'description' => 'Quality scoring against real-world inputs, not synthetic test sets alone.'],
                            ['title' => 'Guardrail & safety testing', 'description' => 'Adversarial and edge-case testing for AI-specific failure modes.'],
                            ['title' => 'Regression testing for AI systems', 'description' => 'Catching quality drift after a model or prompt change.'],
                        ],
                    ],
                ],
            ],
            [
                'name' => 'ServiceNow Bees',
                'slug' => 'servicenow-bees',
                'tagline' => 'Certified ServiceNow delivery, end to end.',
                'summary' => 'Consulting, development, implementation, support, and staffing across the ServiceNow platform.',
                'icon' => 'workflow',
                'color_token' => 'practice-servicenow',
                'key_stats' => [
                    ['value' => 'Certified talent', 'label' => 'ServiceNow-certified resources'],
                    ['value' => '5–7 days', 'label' => 'Resource turnaround'],
                    ['value' => '24/7', 'label' => 'Global delivery coverage'],
                    ['value' => 'OOTB-first', 'label' => 'Delivery approach'],
                ],
                'key_capabilities' => [
                    ['title' => 'Platform Modernization', 'description' => 'Stabilizing over-customized environments, reducing technical debt and preparing ServiceNow for scalable growth.'],
                    ['title' => 'Enterprise Workflow Domains', 'description' => 'ITSM, ITOM, ITAM, CSM and HRSD delivered OOTB-first, extended only where customization earns its place.'],
                    ['title' => 'Upgrade & Release Engineering', 'description' => 'Repeatable upgrade frameworks that remove risk and make every release predictable.'],
                    ['title' => 'Integration & Governance', 'description' => 'Enterprise integrations and CSDM-aligned data model governance across the whole estate.'],
                    ['title' => 'AI-Ready ServiceNow Foundations', 'description' => 'Structured workflows, governed data and automation-ready architecture create a stronger foundation for AI adoption.'],
                    ['title' => 'Enterprise Platform Operations', 'description' => 'Proactive instance management, reliability engineering and continuous optimization — AMS, 24/7.'],
                ],
                'workflow_steps' => [
                    ['step' => 1, 'title' => 'Assess', 'description' => 'Current-state assessment, value cases and stakeholder alignment. Deliverable: assessment report & value case.'],
                    ['step' => 2, 'title' => 'Architect', 'description' => 'Process design, CSDM data model and backlog definition. Deliverable: CSDM model & prioritized backlog.'],
                    ['step' => 3, 'title' => 'Engineer', 'description' => 'Configuration, integrations and iterative agile sprints. Deliverable: configured workflows & integrations.'],
                    ['step' => 4, 'title' => 'Assure', 'description' => 'SIT/UAT, data migration checks and security compliance. Deliverable: test evidence & security sign-off.'],
                    ['step' => 5, 'title' => 'Launch', 'description' => 'Training, organizational change management and cutover. Deliverable: trained users & cutover plan.'],
                    ['step' => 6, 'title' => 'Optimize', 'description' => 'KPI tracking, adoption uplift and continuous improvement. Deliverable: KPI dashboard & improvement roadmap.'],
                ],
                'framework_stack' => [
                    ['category' => 'Modules We Staff', 'tools' => ['ITSM', 'ITOM', 'CSM', 'HRSD', 'ITAM', 'IRM', 'SecOps', 'ESG']],
                    ['category' => 'Development', 'tools' => ['JavaScript', 'Glide APIs', 'Flow Designer', 'Import Sets & Transform Maps']],
                    ['category' => 'Experience & Quality', 'tools' => ['Service Portal', 'UI Builder', 'ATF', 'Performance Analytics', 'ACLs']],
                    ['category' => 'Certifications on the Bench', 'tools' => ['CSA', 'CAD', 'CIS – Data Foundations', 'CIS – HAM', 'ITIL 4']],
                ],
                'technical_capabilities' => [
                    [
                        'title' => 'Staff Augmentation',
                        'points' => [
                            'ServiceNow architects, consultants, developers and support engineers on a T&M basis',
                            '5–7 day resource turnaround',
                            'Certified talent from day one — CSA, CAD, CIS, ITIL 4',
                            'Define → Match → Embed → Scale onboarding path',
                        ],
                        'proven_in' => ['Global HR Platform', 'Global Mining ITSM'],
                    ],
                    [
                        'title' => 'Implementation',
                        'points' => [
                            'Turnkey or modular delivery built on strong ServiceNow DNA',
                            'Out-of-the-box first, custom applications only when needed',
                            'CSDM-aligned data model from day one',
                        ],
                        'proven_in' => ['Manufacturing CMDB', 'National Rail CSDM'],
                    ],
                    [
                        'title' => 'Consulting',
                        'points' => [
                            'Pilot projects, discovery and fit-gap workshops',
                            'Impact assessments to plan transition and maximize the platform',
                            'Strategy before build',
                        ],
                        'proven_in' => ['Global Mining ITSM'],
                    ],
                    [
                        'title' => 'Support & AMS',
                        'points' => [
                            'Post-implementation managed support — upgrades, cloning and continuous instance health',
                            'Long-term instance care, 24/7',
                            'Agile, DevOps-driven delivery',
                        ],
                        'proven_in' => ['National Rail CSDM'],
                    ],
                ],
                'sub_services' => [
                    [
                        'name' => 'Consulting',
                        'slug' => 'consulting',
                        'summary' => 'ServiceNow platform strategy and process-alignment advisory.',
                        'whats_included' => [
                            ['title' => 'Platform strategy assessment', 'description' => 'Where ServiceNow can replace fragmented tools and manual process.'],
                            ['title' => 'Process alignment workshops', 'description' => 'Mapping ITSM/CSM process to platform capability before build.'],
                            ['title' => 'Roadmap & business case', 'description' => 'A phased plan leadership can actually approve and fund.'],
                        ],
                    ],
                    [
                        'name' => 'Development',
                        'slug' => 'development',
                        'summary' => 'Custom application development on the Now Platform.',
                        'whats_included' => [
                            ['title' => 'Custom app scoping & build', 'description' => 'Applications built to your process, not a forced-fit template.'],
                            ['title' => 'Integration development', 'description' => 'ServiceNow connected to the systems it needs to talk to.'],
                            ['title' => 'Upgrade-safe development practices', 'description' => 'Built to survive platform upgrades without breaking.'],
                        ],
                    ],
                    [
                        'name' => 'Implementation',
                        'slug' => 'implementation',
                        'summary' => 'Core platform rollout across ITSM, ITOM, CSM, and HR Service Delivery.',
                        'whats_included' => [
                            ['title' => 'Module implementation', 'description' => 'ITSM, ITOM, CSM, or HRSD configured to your process.'],
                            ['title' => 'Data migration', 'description' => 'Clean migration from legacy ticketing/ITSM tools.'],
                            ['title' => 'User training & rollout', 'description' => 'Adoption support so go-live actually sticks.'],
                        ],
                    ],
                    [
                        'name' => 'Support',
                        'slug' => 'support',
                        'summary' => 'Ongoing managed support and continual platform improvement.',
                        'whats_included' => [
                            ['title' => 'Managed support SLAs', 'description' => 'Defined response times for platform issues, not an ad hoc queue.'],
                            ['title' => 'Release & upgrade management', 'description' => 'Platform kept current without disrupting daily operations.'],
                            ['title' => 'Continuous improvement backlog', 'description' => 'Ongoing enhancement work, not just break-fix.'],
                        ],
                    ],
                    [
                        'name' => 'Staffing',
                        'slug' => 'staffing',
                        'summary' => 'Certified ServiceNow consultants and developers embedded into your team.',
                        'whats_included' => [
                            ['title' => 'Certified consultant placement', 'description' => 'Specialists with the platform certifications your project needs.'],
                            ['title' => 'Flexible engagement length', 'description' => 'From a single project sprint to a long-term embedded role.'],
                            ['title' => 'Knowledge transfer', 'description' => 'Structured handoff so capability stays with your team.'],
                        ],
                    ],
                ],
            ],
            [
                'name' => 'Energy Bees',
                'slug' => 'energy-bees',
                'tagline' => 'Specialist consulting for energy trading platforms.',
                'summary' => 'Deep, named expertise in Endur, Allegro, RightAngle, and TriplePoint, plus energy trading consulting from people who know the platforms and the market.',
                'icon' => 'zap',
                'color_token' => 'practice-energy',
                'key_stats' => [
                    ['value' => 'Endur / Findur', 'label' => 'Primary ETRM/CTRM platform'],
                    ['value' => 'FO · MO · BO', 'label' => 'Front, middle & back office coverage'],
                    ['value' => '8', 'label' => 'Functions staffed'],
                    ['value' => 'T&M', 'label' => 'Staff augmentation model'],
                ],
                'key_capabilities' => [
                    ['title' => 'Techno-Functional Consultants', 'description' => 'Front, middle and back office specialists who can talk to a trader and read the code.'],
                    ['title' => 'Technical Consultants & Developers', 'description' => 'Java, C#/.NET, PL/SQL, T-SQL, Python and platform-native scripting.'],
                    ['title' => 'Integration & Data Migration Engineers', 'description' => 'Interface build, ETL, reconciliation and cutover.'],
                    ['title' => 'Solution Architects & Delivery Leads', 'description' => 'Programme shape, estimates and governance.'],
                ],
                'workflow_steps' => [
                    ['step' => 1, 'title' => 'Define', 'description' => 'Role, stack and success measures for the engagement.'],
                    ['step' => 2, 'title' => 'Match', 'description' => 'A validated shortlist of platform-certified specialists.'],
                    ['step' => 3, 'title' => 'Embed', 'description' => 'Access, onboarding and reporting inside your existing delivery rhythm.'],
                    ['step' => 4, 'title' => 'Scale', 'description' => 'Ramp, transition or rebalance the team as the programme evolves.'],
                ],
                'framework_stack' => [
                    ['category' => 'Endur / Findur', 'tools' => ['Trading, operations & finance', 'OpenComponents', 'AVS/JVS scripting', 'Connex', 'TPM workflows']],
                    ['category' => 'Aspect, Allegro & RightAngle', 'tools' => ['Configuration, interface and support across power, gas and refined products']],
                    ['category' => 'Adjacent Systems', 'tools' => ['Trayport', 'Exchange & broker connectivity', 'Treasury and ERP']],
                    ['category' => 'Functions We Staff', 'tools' => ['Front Office', 'Middle Office & Risk', 'Back Office', 'Scheduling & Logistics', 'Market & Reference Data', 'Integration & Migration', 'Regulatory & Accounting', 'Test & Release Assurance']],
                ],
                'technical_capabilities' => [
                    [
                        'title' => 'Front, Middle & Back Office Coverage',
                        'points' => [
                            'Trade support analysts covering L2/L3 across trading hours, month-end and close',
                            'Business analysts owning requirements, fit-gap and UAT',
                            'Test engineers & automation specialists for regression, upgrade and migration assurance',
                        ],
                        'proven_in' => ['ETRM Modernisation'],
                    ],
                    [
                        'title' => 'Platform-Specific Delivery',
                        'points' => [
                            'Endur / Findur implementation, operations and finance workflows',
                            'Aspect, Allegro & RightAngle configuration and support across power, gas and refined products',
                            'Adjacent systems: Trayport, exchange/broker connectivity, treasury and ERP',
                        ],
                        'proven_in' => ['ETRM Modernisation'],
                    ],
                ],
                'sub_services' => [
                    [
                        'name' => 'Endur',
                        'slug' => 'endur',
                        'summary' => 'Implementation, integration, and support for OpenLink Endur ETRM/CTRM deployments.',
                        'whats_included' => [
                            ['title' => 'Implementation & configuration', 'description' => 'Configured against real desk workflows, not vendor defaults.'],
                            ['title' => 'Risk-reporting migration', 'description' => 'Migrating reporting workflows without disrupting live trading.'],
                            ['title' => 'Ongoing support & upgrades', 'description' => 'Platform kept current without interrupting trading operations.'],
                        ],
                    ],
                    [
                        'name' => 'Allegro',
                        'slug' => 'allegro',
                        'summary' => 'Consulting and implementation support for Allegro CTRM platforms.',
                        'whats_included' => [
                            ['title' => 'Implementation & configuration', 'description' => 'Built around the desk\'s actual trading and risk workflows.'],
                            ['title' => 'Integration development', 'description' => 'Connected to upstream and downstream trading systems.'],
                            ['title' => 'Managed support', 'description' => 'Ongoing platform reliability and issue resolution.'],
                        ],
                    ],
                    [
                        'name' => 'RightAngle',
                        'slug' => 'rightangle',
                        'summary' => 'Implementation and support for RightAngle energy trading and risk management.',
                        'whats_included' => [
                            ['title' => 'Implementation & configuration', 'description' => 'Configured to your physical and financial trading workflows.'],
                            ['title' => 'Integration development', 'description' => 'Connected to the market-data and settlement systems it needs.'],
                            ['title' => 'Managed support', 'description' => 'Ongoing platform reliability across trading operations.'],
                        ],
                    ],
                    [
                        'name' => 'TriplePoint',
                        'slug' => 'triplepoint',
                        'summary' => 'Implementation and support for TriplePoint commodity trading and risk platforms.',
                        'whats_included' => [
                            ['title' => 'Implementation & configuration', 'description' => 'Configured to commodity-specific trading and risk workflows.'],
                            ['title' => 'Integration development', 'description' => 'Connected to the systems your trading desk depends on.'],
                            ['title' => 'Managed support', 'description' => 'Ongoing reliability across live trading operations.'],
                        ],
                    ],
                    [
                        'name' => 'Energy Trading Consulting',
                        'slug' => 'energy-trading-consulting',
                        'summary' => 'Platform-agnostic advisory for energy trading operations and technology strategy.',
                        'whats_included' => [
                            ['title' => 'Platform selection advisory', 'description' => 'Independent guidance on which ETRM/CTRM platform fits your trading model.'],
                            ['title' => 'Trading operations assessment', 'description' => 'Where process and technology are creating risk or inefficiency.'],
                            ['title' => 'Regulatory reporting review', 'description' => 'Accuracy and completeness review against current reporting requirements.'],
                        ],
                    ],
                ],
            ],
        ];
    }
}
