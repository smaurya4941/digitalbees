<?php

namespace Database\Seeders;

use App\Modules\CaseStudy\Models\CaseStudy;
use App\Support\Enums\ContentStatus;
use Illuminate\Database\Seeder;

/**
 * Starter proof content — one flagship case study per practice, plus three
 * additional AI Bees flagships (Divo, HRMS, Testbot). Idempotent. Approved
 * placeholder copy; editors refine from the CMS.
 */
class CaseStudySeeder extends Seeder
{
    public function run(): void
    {
        foreach ($this->caseStudies() as $order => $data) {
            CaseStudy::updateOrCreate(
                ['slug' => $data['slug']],
                [
                    'title' => $data['title'],
                    'client_name' => $data['client_name'],
                    'summary' => $data['summary'],
                    'challenge' => $data['challenge'],
                    'solution' => $data['solution'],
                    'results' => $data['results'],
                    'metrics' => $data['metrics'],
                    'how_it_works' => $data['how_it_works'] ?? null,
                    'capabilities_used' => $data['capabilities_used'] ?? null,
                    'status' => ContentStatus::Published->value,
                    'published_at' => now()->subDays(($order + 1) * 14),
                ],
            );
        }
    }

    /** @return list<array<string, mixed>> */
    private function caseStudies(): array
    {
        return [
            [
                'slug' => 'global-bank-ai-servicing-agents',
                'title' => 'Cutting servicing handle time with production AI agents',
                'client_name' => 'Tier-1 Retail Bank',
                'summary' => 'Production LLM agents wired into core servicing systems reduced average handle time and deflected routine contacts.',
                'challenge' => 'Contact centre volumes were growing faster than headcount and routine requests dominated agent time.',
                'solution' => 'AI Bees built and governed a set of retrieval-grounded agents integrated with the servicing platform, with human-in-the-loop guardrails.',
                'results' => 'Routine contacts deflected at scale with measurable CSAT improvement and no increase in complaints.',
                'metrics' => [
                    ['label' => 'Handle time', 'value' => '-32%'],
                    ['label' => 'Contacts deflected', 'value' => '41%'],
                ],
            ],
            [
                'slug' => 'insurer-core-platform-replatform',
                'title' => 'Replatforming a claims core without a big-bang cutover',
                'client_name' => 'National Insurer',
                'summary' => 'Digital Bees ran an incremental strangler-fig migration of a legacy claims core to a modern cloud platform.',
                'challenge' => 'A 20-year-old claims system blocked product change and carried significant operational risk.',
                'solution' => 'Incremental extraction of capabilities behind APIs, event backbone, and progressive traffic migration.',
                'results' => 'New products shipped in weeks instead of quarters; infrastructure cost per claim fell.',
                'metrics' => [
                    ['label' => 'Release frequency', 'value' => '8x'],
                    ['label' => 'Cost per claim', 'value' => '-27%'],
                ],
            ],
            [
                'slug' => 'saas-scale-engineering-pods',
                'title' => 'Scaling engineering capacity with embedded delivery pods',
                'client_name' => 'Growth-stage SaaS',
                'summary' => 'Talent Bees embedded cross-functional pods that owned roadmap areas end to end.',
                'challenge' => 'Hiring could not keep pace with the product roadmap after a funding round.',
                'solution' => 'Ring-fenced pods with TeamBees delivery leadership, integrated into existing ceremonies and tooling.',
                'results' => 'Roadmap throughput recovered within a quarter while permanent hiring caught up.',
                'metrics' => [
                    ['label' => 'Time to first PR', 'value' => '6 days'],
                    ['label' => 'Roadmap throughput', 'value' => '+45%'],
                ],
            ],
            [
                'slug' => 'retailer-demand-generation-engine',
                'title' => 'Rebuilding a B2B demand generation engine around pipeline',
                'client_name' => 'Omnichannel Retailer',
                'summary' => 'Marketing Bees rebuilt full-funnel campaigns and attribution tied directly to pipeline.',
                'challenge' => 'Marketing spend could not be connected to revenue and campaigns were siloed.',
                'solution' => 'Unified martech stack, closed-loop attribution, and a full-funnel campaign operating model.',
                'results' => 'Marketing-sourced pipeline grew and cost per opportunity dropped.',
                'metrics' => [
                    ['label' => 'Sourced pipeline', 'value' => '+38%'],
                    ['label' => 'Cost per opportunity', 'value' => '-22%'],
                ],
            ],
            [
                'slug' => 'telecom-release-assurance-automation',
                'title' => 'Shift-left quality for a telecom billing platform',
                'client_name' => 'Telecom Operator',
                'summary' => 'Quality Bees introduced CI-integrated automation and performance engineering for a high-risk billing platform.',
                'challenge' => 'Regression cycles took weeks and production incidents clustered around releases.',
                'solution' => 'Automation framework, test data management, and load/resilience testing embedded in the pipeline.',
                'results' => 'Regression time collapsed and release-related incidents fell sharply.',
                'metrics' => [
                    ['label' => 'Regression cycle', 'value' => '3 weeks to 2 days'],
                    ['label' => 'Release incidents', 'value' => '-64%'],
                ],
            ],
            [
                'slug' => 'utility-etrm-modernisation',
                'title' => 'Modernising trading and risk for an energy retailer',
                'client_name' => 'Energy Retailer',
                'summary' => 'Energy Bees delivered an ETRM modernisation with forecasting data products for a fast-growing retailer.',
                'challenge' => 'Spreadsheet-based risk processes could not keep up with portfolio growth and regulatory scrutiny.',
                'solution' => 'ETRM build and integration, curve management, and load/price forecasting pipelines.',
                'results' => 'Position accuracy and reporting timeliness improved; manual effort reduced.',
                'metrics' => [
                    ['label' => 'Close process', 'value' => '-3 days'],
                    ['label' => 'Manual effort', 'value' => '-50%'],
                ],
                'how_it_works' => [
                    ['step' => 1, 'title' => 'Front, Middle & Back Office Assessment', 'description' => 'Trade support analysts and business analysts mapped requirements against real desk workflows.'],
                    ['step' => 2, 'title' => 'ETRM Build & Integration', 'description' => 'Curve management, position and risk workflows configured and connected to upstream/downstream systems.'],
                    ['step' => 3, 'title' => 'Forecasting Data Products', 'description' => 'Load and price forecasting pipelines built to support trading and risk decisions.'],
                    ['step' => 4, 'title' => 'Migration & Assurance', 'description' => 'Test engineers ran regression and migration assurance through cutover.'],
                ],
                'capabilities_used' => ['Front, Middle & Back Office Coverage', 'Platform-Specific Delivery'],
            ],
            [
                'slug' => 'servicenow-hrsd-employee-center',
                'title' => 'HRSD rollout replacing manual case routing for ~6,000 employees',
                'client_name' => 'Global HR & Workforce Solutions Leader',
                'summary' => 'An HRSD rollout with optimized case management and a modern Employee Service Center replaced manual, siloed case routing for a global staffing and talent organization.',
                'challenge' => 'HR cases were routed manually across a worldwide workforce of roughly 6,000 employees, with no unified employee service center and inconsistent resolution times.',
                'solution' => 'ServiceNow Bees delivered an HRSD rollout with optimized case management, a modern Employee Service Center, and OOTB-first configuration extended only where the process genuinely required it.',
                'results' => 'HR case resolution accelerated and the platform reached high adoption within three months of go-live.',
                'metrics' => [
                    ['label' => 'Faster HR case resolution', 'value' => '45%'],
                    ['label' => 'Days to high platform adoption', 'value' => '90'],
                ],
                'how_it_works' => [
                    ['step' => 1, 'title' => 'Assess', 'description' => 'Current-state assessment of HR case routing and stakeholder alignment on the target operating model.'],
                    ['step' => 2, 'title' => 'Architect', 'description' => 'Case management process design and CSDM-aligned data model.'],
                    ['step' => 3, 'title' => 'Engineer', 'description' => 'HRSD and Employee Center Pro configured in iterative agile sprints.'],
                    ['step' => 4, 'title' => 'Launch', 'description' => 'Training and change management rolled out across the full ~6,000-employee workforce.'],
                ],
                'capabilities_used' => ['Implementation', 'Staff Augmentation'],
            ],
            [
                'slug' => 'servicenow-mining-itsm-integration',
                'title' => 'End-to-end ITSM implementation for a global mining major',
                'client_name' => 'Global Mining & Natural Resources Major',
                'summary' => 'A custom service catalog, reusable workflows, and SCCM/LDAP integration replaced siloed service processes for roughly 4,000 users across a multi-region mining operation.',
                'challenge' => 'Service processes were siloed across regions for a ~4,000-user workforce, with no consistent self-service path and slow resolution times.',
                'solution' => 'ServiceNow Bees ran discovery and fit-gap workshops, then delivered an end-to-end ITSM implementation with a custom catalog, reusable workflows, and SCCM/LDAP integration.',
                'results' => 'Service resolution accelerated and self-service resolution rate grew significantly across the multi-region estate.',
                'metrics' => [
                    ['label' => 'Faster service resolution', 'value' => '40%'],
                    ['label' => 'More self-service resolution', 'value' => '50%'],
                ],
                'how_it_works' => [
                    ['step' => 1, 'title' => 'Consulting', 'description' => 'Discovery and fit-gap workshops across multiple regions and business units.'],
                    ['step' => 2, 'title' => 'Architect', 'description' => 'Custom catalog and reusable workflow design mapped to real process.'],
                    ['step' => 3, 'title' => 'Engineer', 'description' => 'SCCM/LDAP integration and ITSM configuration delivered in agile sprints.'],
                    ['step' => 4, 'title' => 'Assure & Launch', 'description' => 'UAT, training, and rollout across the ~4,000-user estate.'],
                ],
                'capabilities_used' => ['Implementation', 'Consulting'],
            ],
            [
                'slug' => 'servicenow-manufacturing-cmdb-csdm',
                'title' => 'CSDM-aligned CMDB across 20+ applications and hybrid datacenters',
                'client_name' => 'Global Manufacturing & Retail Group',
                'summary' => 'A CSDM-aligned CMDB with Identification & Reconciliation Engine, health dashboards, and cloud discovery gave a global manufacturing and retail group a single trusted source of truth.',
                'challenge' => 'Configuration data was fragmented across 20+ business applications and hybrid datacenters, with no single trusted source of truth for change and impact analysis.',
                'solution' => 'ServiceNow Bees implemented a CSDM-aligned CMDB with IRE, health dashboards, and cloud discovery, extending OOTB structures only where customization earned its place.',
                'results' => 'Change accuracy improved and the organization now operates from one trusted source of truth for its full application and infrastructure estate.',
                'metrics' => [
                    ['label' => 'Better change accuracy', 'value' => '35%'],
                    ['label' => 'Trusted source of truth', 'value' => '1'],
                ],
                'how_it_works' => [
                    ['step' => 1, 'title' => 'Architect', 'description' => 'CSDM data model design across 20+ business applications and hybrid datacenters.'],
                    ['step' => 2, 'title' => 'Engineer', 'description' => 'CMDB, IRE, and cloud discovery configured and integrated with existing tooling.'],
                    ['step' => 3, 'title' => 'Assure', 'description' => 'Data migration checks and reconciliation validation before go-live.'],
                    ['step' => 4, 'title' => 'Optimize', 'description' => 'Health dashboards deployed for ongoing CMDB accuracy tracking.'],
                ],
                'capabilities_used' => ['Implementation'],
            ],
            [
                'slug' => 'servicenow-national-rail-csdm',
                'title' => 'Migrating a national rail service catalog to CSDM best practices',
                'client_name' => 'National Rail Infrastructure Operator',
                'summary' => 'Service data was aligned to CSDM best practices and the full service catalog migrated from SharePoint to ServiceNow, replacing years of accumulated custom fields.',
                'challenge' => 'The service catalog lived in SharePoint with years of custom fields layered on top, making CMDB accuracy and platform upgrades increasingly risky.',
                'solution' => 'ServiceNow Bees aligned service data to CSDM best practices and migrated the full catalog into ServiceNow, replacing custom fields with OOTB structures wherever possible.',
                'results' => 'CMDB accuracy improved substantially and the large majority of legacy custom fields moved onto out-of-the-box structures, reducing upgrade risk.',
                'metrics' => [
                    ['label' => 'Better CMDB accuracy', 'value' => '40%'],
                    ['label' => 'Custom fields moved to OOTB', 'value' => '70%+'],
                ],
                'how_it_works' => [
                    ['step' => 1, 'title' => 'Assess', 'description' => 'Audit of the SharePoint-based catalog and the accumulated custom-field debt.'],
                    ['step' => 2, 'title' => 'Architect', 'description' => 'CSDM-aligned data model designed to replace custom fields with OOTB structures.'],
                    ['step' => 3, 'title' => 'Engineer & Assure', 'description' => 'Catalog migration executed with data validation at every stage.'],
                    ['step' => 4, 'title' => 'Optimize', 'description' => 'Ongoing AMS support to keep the estate upgrade-safe.'],
                ],
                'capabilities_used' => ['Implementation', 'Support & AMS'],
            ],
            [
                'slug' => 'divo-multi-agent-finance-crm',
                'title' => 'Multi-agent AI unifying Finance and CRM workflows',
                'client_name' => 'Enterprise Sales & Finance Teams',
                'summary' => 'A governed multi-agent LangGraph system resolves cross-domain queries across CRM and Finance without hallucinating or leaking data across roles.',
                'challenge' => 'Sales and finance teams worked in parallel in Zoho CRM and Zoho Books. Queries crossed domains, and generic chatbots hallucinated and leaked data across roles.',
                'solution' => 'AI Bees built a multi-agent system with episodic and semantic memory scoped per user, hallucinated tool calls intercepted by schema validation, and evals, mutation scoring and planted-bug checks run pre-release.',
                'results' => 'Sales and finance teams now resolve cross-domain queries through one governed agent system, with faster execution and far fewer handling errors.',
                'metrics' => [
                    ['label' => 'Faster task execution', 'value' => '40%'],
                    ['label' => 'Saved per user / day', 'value' => '45-60 min'],
                    ['label' => 'Faster bulk operations', 'value' => '80%'],
                    ['label' => 'Fewer handling errors', 'value' => '40%'],
                ],
                'how_it_works' => [
                    ['step' => 1, 'title' => 'Router agent', 'description' => 'Classifies intent.'],
                    ['step' => 2, 'title' => 'Domain agent', 'description' => 'Routes to CRM, RAG, or Finance specialist agents.'],
                    ['step' => 3, 'title' => 'RBAC filter', 'description' => 'Hard reject on any role mismatch.'],
                    ['step' => 4, 'title' => 'Typed JSON output', 'description' => 'A fallback broadens low-confidence queries.'],
                ],
                'capabilities_used' => ['Agentic Architecture', 'Memory & Retrieval', 'Reliability & Governance', 'Evaluation & Quality'],
            ],
            [
                'slug' => 'hrms-ai-workforce-platform',
                'title' => 'AI workforce platform spanning 10 domains and 5 markets',
                'client_name' => 'Multi-market Enterprise',
                'summary' => 'Ten specialist AI agents run recruiting through workforce analytics across five markets, each scoped to its own jurisdiction\'s employment law.',
                'challenge' => 'Recruiting, HR, compliance and ops sat in separate tools across five markets, each with its own employment law. Generic AI assistants failed every compliance review.',
                'solution' => 'Ten specialist AI agents, each scoped to its function and jurisdiction, with a human review gate on every employment-consequential output and an audit log on every model call across tenant-isolated client data.',
                'results' => 'A single governed platform now runs recruiting through workforce analytics across five markets, with faster hiring and lower cost-per-hire.',
                'metrics' => [
                    ['label' => 'Faster hiring cycles', 'value' => '60%'],
                    ['label' => 'Reduction in time-to-fill', 'value' => '50%'],
                    ['label' => 'Lower cost-per-hire', 'value' => '30%'],
                    ['label' => 'Saved per recruiter / day', 'value' => '2 hrs'],
                ],
                'how_it_works' => [
                    ['step' => 1, 'title' => 'Recruiting & Sourcing', 'description' => 'Specialist agents handle recruiting, sourcing and screening within each market\'s employment law.'],
                    ['step' => 2, 'title' => 'Compliance & Onboarding', 'description' => 'Compliance and onboarding agents apply jurisdiction-specific rules automatically.'],
                    ['step' => 3, 'title' => 'HR Operations & Payroll', 'description' => 'HR operations, payroll review and performance agents keep records consistent across markets.'],
                    ['step' => 4, 'title' => 'Learning & Workforce Analytics', 'description' => 'Learning & development and workforce analytics agents surface insight back to HR leadership.'],
                ],
                'capabilities_used' => ['Agentic Architecture', 'Reliability & Governance'],
            ],
            [
                'slug' => 'testbot-self-healing-ui-tests',
                'title' => 'AI-generated, self-healing UI tests for desktop apps',
                'client_name' => 'Desktop Software Team',
                'summary' => 'A local-first MCP server generates and self-heals autonomous regression tests for native QML/Qt and Windows apps, with zero cloud egress.',
                'challenge' => 'Desktop teams shipping QML/Qt and Windows apps had no autonomous testing: cloud platforms refused native binaries, and regressions kept escaping to release.',
                'solution' => 'A local-first MCP server running inside Claude Code generates tests from full source, not a lossy summary, commits them to git with stable IDs, and self-heals on UI churn — no data leaves the machine.',
                'results' => 'Desktop QA teams ship autonomous, self-healing regression coverage without any cloud egress or credit meters.',
                'metrics' => [
                    ['label' => 'Faster UI test authoring', 'value' => '60-85%'],
                    ['label' => 'Saved per QA engineer / day', 'value' => '3-5 hrs'],
                    ['label' => 'Faster time-to-green', 'value' => '40-60%'],
                    ['label' => 'Cloud egress or credit meters', 'value' => '0'],
                ],
                'how_it_works' => [
                    ['step' => 1, 'title' => 'Discovery', 'description' => 'The agent explores the application to map its screens and flows.'],
                    ['step' => 2, 'title' => 'Plan', 'description' => 'A test plan is drafted against the discovered UI.'],
                    ['step' => 3, 'title' => 'Generate & Run', 'description' => 'Tests are generated from full source and executed against the app.'],
                    ['step' => 4, 'title' => 'Heal & Score', 'description' => 'Failing tests self-heal on UI churn and are scored for reliability.'],
                ],
                'capabilities_used' => ['Memory & Retrieval', 'Evaluation & Quality', 'Platform & Customization'],
            ],
        ];
    }
}
