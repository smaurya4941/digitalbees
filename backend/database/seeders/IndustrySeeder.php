<?php

namespace Database\Seeders;

use App\Modules\Industry\Models\Industry;
use App\Support\Enums\ContentStatus;
use Illuminate\Database\Seeder;

/**
 * Initial industry taxonomy — see information-architecture.md §3.3. Extensible.
 */
class IndustrySeeder extends Seeder
{
    public function run(): void
    {
        $industries = [
            ['Healthcare', 'healthcare', 'activity', 'Providers, payers and health-tech modernising care delivery and operations.'],
            ['Banking & Financial Services', 'banking-financial-services', 'landmark', 'Retail, commercial and capital-markets institutions under constant regulatory and digital pressure.'],
            ['Insurance', 'insurance', 'umbrella', 'Carriers and brokers digitising underwriting, claims and distribution.'],
            ['Retail & eCommerce', 'retail-ecommerce', 'shopping-cart', 'Omnichannel retailers competing on experience, supply chain and margin.'],
            ['Manufacturing', 'manufacturing', 'factory', 'Discrete and process manufacturers connecting the plant floor to the enterprise.'],
            ['Energy & Utilities', 'energy-utilities', 'zap', 'Generators, networks and retailers navigating the energy transition.'],
            ['Technology & Software', 'technology-software', 'cpu', 'ISVs and platforms scaling engineering and go-to-market.'],
            ['Public Sector', 'public-sector', 'building-2', 'Government and agencies delivering digital services at scale.'],
            ['Telecommunications', 'telecom', 'radio-tower', 'Operators modernising OSS/BSS and monetising the network.'],
            ['Logistics & Supply Chain', 'logistics-supply-chain', 'truck', 'Carriers and 3PLs optimising visibility, cost and resilience.'],
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
