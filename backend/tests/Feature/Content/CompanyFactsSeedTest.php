<?php

namespace Tests\Feature\Content;

use App\Modules\Career\Models\JobPosting;
use App\Modules\Region\Models\Location;
use App\Modules\Region\Models\Region;
use Database\Seeders\LocationSeeder;
use Database\Seeders\RegionSeeder;
use Database\Seeders\SettingSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * Company facts must match TeamBees' published profile decks: the four
 * offices, the contact inbox and the headline figures.
 */
class CompanyFactsSeedTest extends TestCase
{
    use RefreshDatabase;

    public function test_offices_are_the_four_published_in_the_decks(): void
    {
        $this->seed([RegionSeeder::class, LocationSeeder::class]);

        $this->assertEqualsCanonicalizing(
            ['gurugram', 'chicago', 'singapore', 'dubai'],
            Location::pluck('slug')->all(),
        );

        $gurugram = Location::firstWhere('slug', 'gurugram');
        $this->assertStringContainsString('Spaze i-Tech Park', $gurugram->address);
        $this->assertSame('india', $gurugram->region->slug);
        $this->assertStringContainsString('200 E 75th Street', Location::firstWhere('slug', 'chicago')->address);

        // No published address → no address or map pin.
        $dubai = Location::firstWhere('slug', 'dubai');
        $this->assertNull($dubai->address);
        $this->assertNull($dubai->lat);
    }

    public function test_reseeding_retires_previously_seeded_fabricated_offices(): void
    {
        $this->seed(RegionSeeder::class);
        $usa = Region::firstWhere('slug', 'usa');
        $fake = Location::create([
            'region_id' => $usa->id, 'name' => 'TeamBees New York', 'slug' => 'new-york',
            'city' => 'New York', 'country' => 'United States', 'status' => 'published',
        ]);
        $job = JobPosting::create(['title' => 'Engineer', 'slug' => 'engineer', 'location_id' => $fake->id]);

        // An editor's own office that merely shares a retired slug stays.
        $editorOwned = Location::create([
            'region_id' => $usa->id, 'name' => 'Austin HQ', 'slug' => 'austin',
            'city' => 'Austin Downtown', 'status' => 'published',
        ]);

        $this->seed(LocationSeeder::class);

        $this->assertNull(Location::firstWhere('slug', 'new-york'));
        $this->assertNull($job->fresh()->location_id);
        $this->assertNotNull($editorOwned->fresh());
    }

    public function test_public_settings_expose_the_deck_facts(): void
    {
        $this->seed(SettingSeeder::class);

        // Keys contain dots, so read the payload rather than use JSON paths.
        $settings = $this->getJson('/api/v1/settings')->assertOk()->json('data');

        $this->assertSame('info@teambeescorp.com', $settings['contact.email']);
        $this->assertSame('India, USA, Singapore, UAE', $settings['company.markets']);
        $this->assertSame('2 business days', $settings['company.shortlist_turnaround']);
        $this->assertSame('2021', $settings['company.established']);
    }
}
