<?php

namespace Database\Seeders;

use App\Modules\Career\Models\JobPosting;
use App\Modules\Region\Models\Location;
use App\Modules\Region\Models\Region;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

/**
 * TeamBees' offices, as published in its own profile decks
 * (docs/Docs/TeamBees Profile - *.pdf: "Global Footprint" and the contact
 * slide): India (Gurugram, the offshore delivery centre) and USA (Chicago)
 * with street addresses, plus Singapore and UAE (Dubai) presence without a
 * published address. Idempotent on (region, city).
 *
 * Singapore and Dubai deliberately carry no address or coordinates — the
 * decks give none, and coordinates would put a precise pin on the map and
 * into `LocalBusiness` schema for a site that isn't published.
 */
class LocationSeeder extends Seeder
{
    /**
     * Offices an earlier version of this seeder invented (no source backed
     * them). Removed on every run so existing databases are corrected, not
     * just fresh installs. Matched on slug + city so an editor-created
     * location that happens to reuse one of these slugs is left alone.
     *
     * @var array<string, string> slug => city
     */
    private const RETIRED = [
        'bangalore' => 'Bangalore',
        'new-york' => 'New York',
        'austin' => 'Austin',
        'london' => 'London',
        'krakow' => 'Krakow',
        'toronto' => 'Toronto',
        'sydney' => 'Sydney',
    ];

    public function run(): void
    {
        $this->retireFabricatedOffices();

        // [region slug, city, country, address, lat, lng]
        // Coordinates are geocoded from the published street address.
        $locations = [
            ['india', 'Gurugram', 'India', '337-338, Block-B3, Spaze i-Tech Park, Sector 49, Gurugram, Haryana 122018', 28.4133, 77.0413],
            ['usa', 'Chicago', 'United States', '200 E 75th Street, Chicago, IL 60619', 41.7586, -87.6197],
            ['singapore', 'Singapore', 'Singapore', null, null, null],
            ['uae', 'Dubai', 'United Arab Emirates', null, null, null],
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
                    'slug' => Str::slug($city),
                    'address' => $address,
                    'country' => $country,
                    'lat' => $lat,
                    'lng' => $lng,
                    'status' => 'published',
                ],
            );
        }
    }

    private function retireFabricatedOffices(): void
    {
        $retired = Location::query()
            ->whereIn('slug', array_keys(self::RETIRED))
            ->get()
            ->filter(fn (Location $location): bool => self::RETIRED[$location->slug] === $location->city);

        if ($retired->isEmpty()) {
            return;
        }

        // `job_postings.location_id` has no FK constraint; clear it so no
        // posting points at a deleted office.
        JobPosting::query()
            ->whereIn('location_id', $retired->modelKeys())
            ->update(['location_id' => null]);

        // Model deletes (not a bulk query) so the audit trail records them.
        $retired->each->delete();
    }
}
