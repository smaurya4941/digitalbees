<?php

namespace Tests\Feature\Search;

use Database\Seeders\CaseStudySeeder;
use Database\Seeders\EntityRelationSeeder;
use Database\Seeders\IndustrySeeder;
use Database\Seeders\PracticeSeeder;
use Database\Seeders\RegionSeeder;
use Database\Seeders\TechnologySeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * Global search (blueprint §30). Runs against the `database` Scout driver
 * (phpunit.xml pins SEARCH_DRIVER=database) so these tests need no live
 * Meilisearch server.
 */
class SearchApiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed([
            PracticeSeeder::class,
            IndustrySeeder::class,
            RegionSeeder::class,
            TechnologySeeder::class,
            CaseStudySeeder::class,
            EntityRelationSeeder::class,
        ]);
    }

    public function test_search_returns_grouped_results_by_type(): void
    {
        $response = $this->getJson('/api/v1/search?q=AI Bees');

        $response->assertOk();

        $types = collect($response->json('data'))->pluck('type')->unique();
        $this->assertContains('practice', $types);

        $practiceHit = collect($response->json('data'))->firstWhere('type', 'practice');
        $this->assertSame('AI Bees', $practiceHit['title']);
        $this->assertSame('/practices/ai-bees', $practiceHit['url']);
    }

    public function test_search_can_be_scoped_to_one_type(): void
    {
        $response = $this->getJson('/api/v1/search?q=Bees&type=practice');

        $response->assertOk();
        $types = collect($response->json('data'))->pluck('type')->unique();
        $this->assertEqualsCanonicalizing(['practice'], $types->all());
    }

    public function test_a_query_below_the_minimum_length_is_rejected(): void
    {
        $this->getJson('/api/v1/search?q=a')->assertUnprocessable();
    }

    public function test_a_missing_query_is_rejected(): void
    {
        $this->getJson('/api/v1/search')->assertUnprocessable();
    }

    public function test_a_query_with_no_matches_returns_an_empty_but_successful_response(): void
    {
        $response = $this->getJson('/api/v1/search?q=zzz-no-such-thing-zzz');

        $response->assertOk()->assertJsonPath('meta.count', 0);
    }
}
