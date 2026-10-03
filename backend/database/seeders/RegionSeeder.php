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
            ['India', 'india', 'IN', 'Offshore delivery centre in Gurugram — scalable engineering pods and 24x7 follow-the-sun technology delivery.'],
            ['USA', 'usa', 'US', 'Office in Chicago — delivery and talent across the United States.'],
            ['Singapore', 'singapore', 'SG', 'APAC regional hub, commodity trading desk support, and Asian financial markets gateway.'],
            ['UAE', 'uae', 'AE', 'Middle East delivery for energy, public sector, and financial services aligned with DIFC and ADGM.'],
            ['UK', 'uk', 'GB', 'Delivery and specialist talent for UK clients, served from our delivery markets.'],
            ['Europe', 'europe', 'EU', 'Delivery and specialist talent for EU clients, with GDPR-aligned operations.'],
            ['Canada', 'canada', 'CA', 'Delivery and specialist talent for Canadian clients and North American programmes.'],
            ['Australia', 'australia', 'AU', 'Delivery and specialist talent for Australian clients across public and private sector.'],
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
