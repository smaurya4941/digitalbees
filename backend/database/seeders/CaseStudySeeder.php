<?php

namespace Database\Seeders;

use App\Modules\CaseStudy\Models\CaseStudy;
use App\Support\Enums\ContentStatus;
use Illuminate\Database\Seeder;

/**
 * Starter proof content — one flagship case study per practice. Idempotent.
 * Approved placeholder copy; editors refine from the CMS.
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
            ],
        ];
    }
}
