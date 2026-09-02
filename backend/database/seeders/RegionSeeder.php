<?php

namespace Database\Seeders;

use App\Modules\Region\Models\Region;
use App\Support\Enums\ContentStatus;
use Illuminate\Database\Seeder;

/**
 * The six operating regions — see information-architecture.md §3.4. Fixed set.
 */
class RegionSeeder extends Seeder
{
    public function run(): void
    {
        $regions = [
            ['USA', 'usa', 'US', 'Delivery and talent across the United States, with nearshore capacity in Latin America.'],
            ['UK', 'uk', 'GB', 'UK-based delivery leadership with SC-cleared talent available for regulated work.'],
            ['Europe', 'europe', 'EU', 'Nearshore engineering hubs serving the EU with GDPR-aligned operations.'],
            ['Canada', 'canada', 'CA', 'Canadian delivery centres supporting North American programmes.'],
            ['Australia', 'australia', 'AU', 'Local presence for APAC clients across public and private sector.'],
            ['UAE', 'uae', 'AE', 'Middle East delivery for energy, public sector and financial services.'],
        ];

        foreach ($regions as $order => [$name, $slug, $iso, $summary]) {
            Region::updateOrCreate(
                ['slug' => $slug],
                [
                    'name' => $name,
                    'iso_code' => $iso,
                    'summary' => $summary,
                    'sort_order' => $order,
                    'status' => ContentStatus::Published->value,
                ],
            );
        }
    }
}
