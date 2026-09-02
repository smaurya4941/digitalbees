<?php

namespace Database\Seeders;

use App\Modules\Practice\Models\Practice;
use App\Modules\Practice\Models\SubService;
use App\Support\Enums\ContentStatus;
use Illuminate\Database\Seeder;

/**
 * The seven practices and their sub-services — see
 * docs/architecture/information-architecture.md §3.1-3.2. Idempotent.
 */
class PracticeSeeder extends Seeder
{
    public function run(): void
    {
        foreach ($this->practices() as $order => $data) {
            $subServices = $data['sub_services'];
            unset($data['sub_services']);

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
                        'sort_order' => $subOrder,
                        'status' => ContentStatus::Published->value,
                    ],
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
                'tagline' => 'Vetted technology talent, embedded fast.',
                'summary' => 'Dedicated engineers, contractors and full teams sourced from the top of the market and embedded directly into your delivery.',
                'icon' => 'users',
                'color_token' => 'brand-gold',
                'sub_services' => [
                    ['name' => 'Staff Augmentation', 'slug' => 'staff-augmentation', 'summary' => 'Individual specialists added to your existing teams.'],
                    ['name' => 'Dedicated Teams', 'slug' => 'dedicated-teams', 'summary' => 'A ring-fenced cross-functional team owned end to end.'],
                    ['name' => 'Executive & Niche Search', 'slug' => 'executive-search', 'summary' => 'Leadership and hard-to-fill specialist hiring.'],
                    ['name' => 'Managed Delivery Pods', 'slug' => 'managed-delivery-pods', 'summary' => 'Outcome-based pods with TeamBees delivery leadership.'],
                ],
            ],
            [
                'name' => 'Digital Bees',
                'slug' => 'digital-bees',
                'tagline' => 'Digital transformation and software engineering.',
                'summary' => 'Product strategy, modern application engineering and cloud modernisation for enterprises replatforming core systems.',
                'icon' => 'layers',
                'color_token' => 'brand-navy',
                'sub_services' => [
                    ['name' => 'Product & Platform Engineering', 'slug' => 'product-engineering', 'summary' => 'Greenfield and re-platform builds on a modern stack.'],
                    ['name' => 'Cloud Modernisation', 'slug' => 'cloud-modernisation', 'summary' => 'Migration, re-architecture and FinOps for AWS / Azure / GCP.'],
                    ['name' => 'Data & Integration', 'slug' => 'data-and-integration', 'summary' => 'Pipelines, APIs and event backbones that unlock data.'],
                    ['name' => 'Legacy Modernisation', 'slug' => 'legacy-modernisation', 'summary' => 'Incremental strangler-fig replacement of core systems.'],
                ],
            ],
            [
                'name' => 'AI Bees',
                'slug' => 'ai-bees',
                'tagline' => 'Applied AI, automation and production agents.',
                'summary' => 'From opportunity assessment to production-grade AI agents and automation integrated into real workflows.',
                'icon' => 'sparkles',
                'color_token' => 'brand-gold',
                'sub_services' => [
                    ['name' => 'AI Strategy & Assessment', 'slug' => 'ai-strategy', 'summary' => 'Use-case discovery, feasibility and ROI modelling.'],
                    ['name' => 'Agent & Automation Engineering', 'slug' => 'agent-engineering', 'summary' => 'Production LLM agents wired into your systems.'],
                    ['name' => 'ML Engineering & MLOps', 'slug' => 'ml-engineering', 'summary' => 'Model development, deployment and lifecycle operations.'],
                    ['name' => 'AI Governance & Safety', 'slug' => 'ai-governance', 'summary' => 'Evaluation, guardrails and compliance for AI systems.'],
                ],
            ],
            [
                'name' => 'Marketing Bees',
                'slug' => 'marketing-bees',
                'tagline' => 'Digital marketing strategy and execution.',
                'summary' => 'Demand generation, marketing technology and performance execution for B2B growth teams.',
                'icon' => 'megaphone',
                'color_token' => 'brand-navy',
                'sub_services' => [
                    ['name' => 'Demand Generation', 'slug' => 'demand-generation', 'summary' => 'Full-funnel campaigns tied to pipeline.'],
                    ['name' => 'SEO & Content Engineering', 'slug' => 'seo-content', 'summary' => 'Technical SEO and scalable content operations.'],
                    ['name' => 'Marketing Technology', 'slug' => 'martech', 'summary' => 'CRM, automation and attribution implementation.'],
                    ['name' => 'Web & Conversion', 'slug' => 'web-and-conversion', 'summary' => 'High-performance sites and CRO programmes.'],
                ],
            ],
            [
                'name' => 'Quality Bees',
                'slug' => 'quality-bees',
                'tagline' => 'Quality engineering, QA and test automation.',
                'summary' => 'Shift-left quality practices, automation frameworks and release assurance for complex enterprise platforms.',
                'icon' => 'shield-check',
                'color_token' => 'brand-navy',
                'sub_services' => [
                    ['name' => 'Test Automation', 'slug' => 'test-automation', 'summary' => 'Framework design and CI-integrated automation suites.'],
                    ['name' => 'Performance Engineering', 'slug' => 'performance-engineering', 'summary' => 'Load, stress and resilience testing.'],
                    ['name' => 'QA Managed Services', 'slug' => 'qa-managed-services', 'summary' => 'Ongoing quality ownership across programmes.'],
                    ['name' => 'Accessibility & Compliance Testing', 'slug' => 'accessibility-testing', 'summary' => 'WCAG 2.2 AA and regulatory conformance.'],
                ],
            ],
            [
                'name' => 'ServiceNow Bees',
                'slug' => 'servicenow-bees',
                'tagline' => 'ServiceNow implementation and consulting.',
                'summary' => 'Advisory, implementation and managed services across ITSM, ITOM, HRSD and custom app development on the Now platform.',
                'icon' => 'workflow',
                'color_token' => 'brand-gold',
                'sub_services' => [
                    ['name' => 'ITSM & ITOM Implementation', 'slug' => 'itsm-itom', 'summary' => 'Core platform rollout and process alignment.'],
                    ['name' => 'HR & Employee Workflows', 'slug' => 'hrsd', 'summary' => 'HRSD and employee-experience delivery.'],
                    ['name' => 'Custom App Development', 'slug' => 'custom-apps', 'summary' => 'Scoped applications on the Now platform.'],
                    ['name' => 'Managed Services & Optimisation', 'slug' => 'managed-services', 'summary' => 'Run, support and continual improvement.'],
                ],
            ],
            [
                'name' => 'Energy Bees',
                'slug' => 'energy-bees',
                'tagline' => 'Technology for the energy sector.',
                'summary' => 'Trading platforms, grid and asset systems, and data products for utilities, traders and renewable operators.',
                'icon' => 'zap',
                'color_token' => 'brand-gold',
                'sub_services' => [
                    ['name' => 'Trading & Risk Platforms', 'slug' => 'trading-and-risk', 'summary' => 'ETRM/CTRM build, integration and support.'],
                    ['name' => 'Grid & Asset Systems', 'slug' => 'grid-and-asset-systems', 'summary' => 'Operational technology for distributed assets.'],
                    ['name' => 'Energy Data & Forecasting', 'slug' => 'energy-data-forecasting', 'summary' => 'Load, price and generation forecasting products.'],
                    ['name' => 'Sustainability & Reporting', 'slug' => 'sustainability-reporting', 'summary' => 'Emissions and regulatory reporting systems.'],
                ],
            ],
        ];
    }
}
