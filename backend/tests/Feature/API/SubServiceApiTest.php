<?php

namespace Tests\Feature\API;

use Database\Seeders\CaseStudySeeder;
use Database\Seeders\EntityRelationSeeder;
use Database\Seeders\IndustrySeeder;
use Database\Seeders\PracticeSeeder;
use Database\Seeders\RegionSeeder;
use Database\Seeders\TechnologySeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * The `sub-service` template contract (blueprint §22.3): a leaner page than
 * the practice hub — hero, 2 proof points, a "what's included" list, one
 * case study, and a single CTA.
 */
class SubServiceApiTest extends TestCase
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

    public function test_sub_service_returns_the_full_contract(): void
    {
        $response = $this->getJson('/api/v1/practices/ai-bees/sub-services/ai-agents');

        $response->assertOk()
            ->assertJsonPath('data.slug', 'ai-agents')
            ->assertJsonPath('data.template', 'sub-service')
            ->assertJsonPath('data.href', '/practices/ai-bees/ai-agents')
            ->assertJsonPath('data.practice.slug', 'ai-bees')
            ->assertJsonPath('data.hero.title', 'AI Agents')
            ->assertJsonPath('data.cta.url', '/contact-us')
            ->assertJsonStructure([
                'data' => [
                    'whats_included' => [['title', 'description']],
                    'proof_points' => [['value', 'label']],
                    'seo' => ['meta_title', 'canonical_url', 'schema_type'],
                ],
            ]);

        $this->assertNotEmpty($response->json('data.whats_included'));
        // ai-agents is under ai-bees, which the CaseStudySeeder/EntityRelationSeeder graph tags a case study to.
        $this->assertNotNull($response->json('data.case_study'));
    }

    public function test_unknown_sub_service_slug_is_a_real_404(): void
    {
        $this->getJson('/api/v1/practices/ai-bees/sub-services/does-not-exist')->assertNotFound();
    }

    public function test_a_sub_service_slug_belonging_to_a_different_practice_404s(): void
    {
        // "ai-agents" belongs to ai-bees, not digital-bees.
        $this->getJson('/api/v1/practices/digital-bees/sub-services/ai-agents')->assertNotFound();
    }
}
