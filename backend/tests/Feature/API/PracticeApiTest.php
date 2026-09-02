<?php

namespace Tests\Feature\API;

use App\Modules\Practice\Models\Practice;
use App\Support\Enums\ContentStatus;
use Database\Seeders\EntityRelationSeeder;
use Database\Seeders\IndustrySeeder;
use Database\Seeders\PracticeSeeder;
use Database\Seeders\RegionSeeder;
use Database\Seeders\TechnologySeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PracticeApiTest extends TestCase
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
            EntityRelationSeeder::class,
        ]);
    }

    public function test_index_returns_all_published_practices_in_the_envelope(): void
    {
        $response = $this->getJson('/api/v1/practices');

        $response->assertOk()
            ->assertJsonStructure([
                'data' => [['id', 'slug', 'name', 'tagline', 'summary', 'href', 'sub_services_count']],
                'meta' => ['count'],
                'links',
            ])
            ->assertJsonPath('meta.count', 7);

        $this->assertSame('/practices/talent-bees', $response->json('data.0.href'));
    }

    public function test_index_excludes_unpublished_practices(): void
    {
        Practice::query()->where('slug', 'energy-bees')->update(['status' => ContentStatus::Draft->value]);

        $this->getJson('/api/v1/practices')
            ->assertOk()
            ->assertJsonPath('meta.count', 6)
            ->assertJsonMissing(['slug' => 'energy-bees']);
    }

    public function test_show_returns_the_full_practice_template_contract(): void
    {
        $response = $this->getJson('/api/v1/practices/ai-bees');

        $response->assertOk()
            ->assertJsonPath('data.slug', 'ai-bees')
            ->assertJsonPath('data.template', 'practice')
            ->assertJsonStructure([
                'data' => [
                    'id', 'slug', 'name', 'template', 'href',
                    'hero' => ['eyebrow', 'title', 'description', 'cta' => ['label', 'url']],
                    'proof_points' => [['value', 'label']],
                    'how_we_work' => [['step', 'title', 'description']],
                    'services' => [['id', 'slug', 'name', 'href']],
                    'industries' => [['id', 'slug', 'name', 'href']],
                    'technologies' => [['id', 'slug', 'name', 'href']],
                    'regions' => [['id', 'slug', 'name', 'href']],
                    'related_practices' => [['id', 'slug', 'name', 'href']],
                    'seo' => ['meta_title', 'canonical_url', 'robots', 'schema_json'],
                ],
            ]);

        $this->assertNotEmpty($response->json('data.industries'));
        $this->assertNotEmpty($response->json('data.technologies'));
        $this->assertCount(6, $response->json('data.related_practices'));
        $this->assertStringContainsString('/practices/ai-bees', $response->json('data.seo.canonical_url'));
        $this->assertSame('Service', $response->json('data.seo.schema_json.@type'));
    }

    public function test_show_sub_service_href_points_back_to_the_practice(): void
    {
        $response = $this->getJson('/api/v1/practices/ai-bees');

        $first = $response->json('data.services.0');
        $this->assertStringStartsWith('/practices/ai-bees/', $first['href']);
    }

    public function test_show_returns_404_for_unknown_or_unpublished_practice(): void
    {
        $this->getJson('/api/v1/practices/does-not-exist')->assertNotFound();

        Practice::query()->where('slug', 'ai-bees')->update(['status' => ContentStatus::Draft->value]);
        $this->getJson('/api/v1/practices/ai-bees')->assertNotFound();
    }

    public function test_sub_service_endpoint_resolves_within_its_practice(): void
    {
        $this->getJson('/api/v1/practices/ai-bees/sub-services/ml-engineering')
            ->assertOk()
            ->assertJsonPath('data.slug', 'ml-engineering')
            ->assertJsonPath('data.href', '/practices/ai-bees/ml-engineering');

        // Wrong practice for that sub-service slug.
        $this->getJson('/api/v1/practices/digital-bees/sub-services/ml-engineering')
            ->assertNotFound();
    }
}
