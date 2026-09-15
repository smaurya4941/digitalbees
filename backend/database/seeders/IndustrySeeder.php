<?php

namespace Database\Seeders;

use App\Modules\Industry\Models\Industry;
use App\Support\Enums\ContentStatus;
use Illuminate\Database\Seeder;

/**
 * Industry taxonomy — see information-architecture.md §3.3 and blueprint §2.2
 * (Level 2 — Industries, 10 verticals plus a partner/channel-focused Global
 * System Integrators page). "Insurance" is kept as its own row alongside the
 * blueprint's combined "Banking, Financial Services & Insurance" naming
 * because it already existed here with real content — a deliberate addition,
 * not a blueprint gap. Extensible.
 */
class IndustrySeeder extends Seeder
{
    public function run(): void
    {
        $industries = [
            ['Healthcare & Life Sciences', 'healthcare', 'activity', 'Providers, payers and health-tech modernising care delivery and operations.'],
            ['Banking, Financial Services & Insurance', 'banking-financial-services', 'landmark', 'Retail, commercial and capital-markets institutions under constant regulatory and digital pressure.'],
            ['Insurance', 'insurance', 'umbrella', 'Carriers and brokers digitising underwriting, claims and distribution.'],
            ['Retail & eCommerce', 'retail-ecommerce', 'shopping-cart', 'Omnichannel retailers competing on experience, supply chain and margin.'],
            ['Manufacturing & Industrial', 'manufacturing', 'factory', 'Discrete and process manufacturers connecting the plant floor to the enterprise.'],
            ['Energy, Oil & Gas, and Utilities', 'energy-utilities', 'zap', 'Generators, networks, upstream operators and retailers navigating the energy transition.'],
            ['SaaS & Technology', 'technology-software', 'cpu', 'ISVs and platforms scaling engineering and go-to-market.'],
            ['Public Sector & Government', 'public-sector', 'building-2', 'Government and agencies delivering digital services at scale.'],
            ['Telecom & Media', 'telecom', 'radio-tower', 'Operators modernising OSS/BSS and monetising the network.'],
            ['Logistics & Supply Chain', 'logistics-supply-chain', 'truck', 'Carriers and 3PLs optimising visibility, cost and resilience.'],
            ['Global System Integrators', 'global-system-integrators', 'handshake', 'Co-delivery and partner-channel work alongside GSIs — a distinct, non-vendor tone.'],
        ];

        foreach ($industries as $order => [$name, $slug, $icon, $summary]) {
            Industry::updateOrCreate(
                ['slug' => $slug],
                [
                    'name' => $name,
                    'icon' => $icon,
                    'summary' => $summary,
                    'sort_order' => $order,
                    'status' => ContentStatus::Published->value,
                ],
            );
        }
    }
}
