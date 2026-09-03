<?php

namespace Database\Seeders;

use App\Modules\Region\Models\Location;
use App\Modules\Region\Models\Region;
use Illuminate\Database\Seeder;

/**
 * One or two delivery locations per region. Idempotent on (region, city).
 */
class LocationSeeder extends Seeder
{
    public function run(): void
    {
        $locations = [
            ['usa', 'New York', 'United States', 'New York, NY', 40.7128, -74.0060],
            ['usa', 'Austin', 'United States', 'Austin, TX', 30.2672, -97.7431],
            ['uk', 'London', 'United Kingdom', 'London', 51.5072, -0.1276],
            ['europe', 'Krakow', 'Poland', 'Krakow', 50.0647, 19.9450],
            ['canada', 'Toronto', 'Canada', 'Toronto, ON', 43.6532, -79.3832],
            ['australia', 'Sydney', 'Australia', 'Sydney, NSW', -33.8688, 151.2093],
            ['uae', 'Dubai', 'United Arab Emirates', 'Dubai', 25.2048, 55.2708],
        ];

        foreach ($locations as [$regionSlug, $city, $country, $address, $lat, $lng]) {
            $region = Region::query()->where('slug', $regionSlug)->first();

            if ($region === null) {
                continue;
            }

            Location::updateOrCreate(
                ['region_id' => $region->id, 'city' => $city],
                [
                    'name' => "TeamBees {$city}",
                    'address' => $address,
                    'country' => $country,
                    'lat' => $lat,
                    'lng' => $lng,
                    'status' => 'published',
                ],
            );
        }
    }
}
