<?php

namespace Tests\Feature\API;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TaxonomyApiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed();
    }

    public function test_industries_index_and_detail(): void
    {
        $this->getJson('/api/v1/industries')
            ->assertOk()
            ->assertJsonStructure(['data' => [['id', 'slug', 'name', 'href']], 'meta' => ['count']]);

        $response = $this->getJson('/api/v1/industries/banking-financial-services');

        $response->assertOk()
            ->assertJsonPath('data.slug', 'banking-financial-services')
            ->assertJsonPath('data.template', 'industry')
            ->assertJsonStructure([
                'data' => [
                    'hero' => ['eyebrow', 'title', 'description'],
                    'practices' => [['id', 'slug', 'name', 'href']],
                    'technologies',
                    'case_studies',
                    'seo' => ['meta_title', 'canonical_url', 'robots'],
                ],
            ]);

        $this->assertNotEmpty($response->json('data.practices'));
        $this->assertNotEmpty($response->json('data.case_studies'));
    }

    public function test_regions_index_and_detail_with_locations(): void
    {
        $this->getJson('/api/v1/regions')->assertOk()->assertJsonPath('meta.count', 6);

        $response = $this->getJson('/api/v1/regions/uk');

        $response->assertOk()
            ->assertJsonPath('data.template', 'region')
            ->assertJsonStructure(['data' => ['practices', 'locations', 'case_studies', 'seo']]);

        $this->assertNotEmpty($response->json('data.locations'));
        $this->assertNotEmpty($response->json('data.practices'));
    }

    public function test_technologies_index_and_detail(): void
    {
        $this->getJson('/api/v1/technologies')->assertOk()->assertJsonStructure(['data' => [['id', 'slug', 'name', 'href']]]);

        $response = $this->getJson('/api/v1/technologies/aws');

        $response->assertOk()
            ->assertJsonPath('data.template', 'technology')
            ->assertJsonStructure(['data' => ['practices', 'industries', 'case_studies', 'seo']]);

        $this->assertNotEmpty($response->json('data.practices'));
    }

    public function test_case_studies_index_and_detail(): void
    {
        $this->getJson('/api/v1/case-studies')
            ->assertOk()
            ->assertJsonStructure(['data' => [['id', 'slug', 'title', 'href']]]);

        $response = $this->getJson('/api/v1/case-studies/global-bank-ai-servicing-agents');

        $response->assertOk()
            ->assertJsonPath('data.template', 'case-study')
            ->assertJsonStructure([
                'data' => ['challenge', 'solution', 'results', 'metrics', 'practices', 'industries', 'seo'],
            ]);

        $this->assertNotEmpty($response->json('data.practices'));
    }

    public function test_practice_detail_now_includes_case_studies(): void
    {
        $response = $this->getJson('/api/v1/practices/ai-bees');

        $response->assertOk();
        $this->assertNotEmpty($response->json('data.case_studies'));
        $this->assertSame(
            '/case-studies/global-bank-ai-servicing-agents',
            $response->json('data.case_studies.0.href'),
        );
    }

    public function test_navigation_returns_menu_trees(): void
    {
        $response = $this->getJson('/api/v1/navigation');

        $response->assertOk()
            ->assertJsonStructure(['data' => ['header', 'footer', 'mega-practices']]);

        $this->assertSame('Practices', $response->json('data.header.0.label'));
        $this->assertNotEmpty($response->json('data.footer.0.children'));
    }

    public function test_unknown_slug_returns_404(): void
    {
        $this->getJson('/api/v1/industries/nope')->assertNotFound();
        $this->getJson('/api/v1/regions/nope')->assertNotFound();
        $this->getJson('/api/v1/technologies/nope')->assertNotFound();
        $this->getJson('/api/v1/case-studies/nope')->assertNotFound();
    }
}
