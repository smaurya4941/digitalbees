<?php

namespace Tests\Feature\Content;

use Database\Seeders\CaseStudySeeder;
use Database\Seeders\CombinatorialPageSeeder;
use Database\Seeders\EntityRelationSeeder;
use Database\Seeders\IndustrySeeder;
use Database\Seeders\PageTemplateSeeder;
use Database\Seeders\PracticeSeeder;
use Database\Seeders\RegionSeeder;
use Database\Seeders\TechnologySeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * Curated Practice x Industry / Region x Practice pages (blueprint §7.2's
 * anti-thin-content rule). Only seeded pairs resolve; every other
 * combination — even of otherwise-valid slugs — must 404, never render a
 * thin auto-generated page (IA doc §5 rule 4, §7).
 */
class CombinatorialPageTest extends TestCase
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
            PageTemplateSeeder::class,
            CombinatorialPageSeeder::class,
        ]);
    }

    public function test_a_curated_industry_practice_pair_resolves(): void
    {
        $response = $this->getJson('/api/v1/pages/resolve?path=/industries/energy-utilities/energy-bees');

        $response->assertOk()
            ->assertJsonPath('data.template_key', 'industry-practice')
            ->assertJsonPath('data.primary_entity.slug', 'energy-utilities')
            ->assertJsonPath('data.secondary_entity.slug', 'energy-bees')
            ->assertJsonPath('data.sections.hero.title', fn ($v) => is_string($v) && str_contains($v, 'Energy Bees'))
            ->assertJsonStructure(['data' => ['case_studies', 'seo' => ['meta_title', 'canonical_url']]]);

        // Overlap between the practice's and industry's case studies should surface here.
        $this->assertNotEmpty($response->json('data.case_studies'));
    }

    public function test_a_curated_region_practice_pair_resolves(): void
    {
        $this->getJson('/api/v1/pages/resolve?path=/regions/uae/talent-bees')
            ->assertOk()
            ->assertJsonPath('data.template_key', 'region-practice')
            ->assertJsonPath('data.primary_entity.slug', 'uae')
            ->assertJsonPath('data.secondary_entity.slug', 'talent-bees');
    }

    public function test_a_second_curated_industry_practice_pair_resolves(): void
    {
        $this->getJson('/api/v1/pages/resolve?path=/industries/healthcare/ai-bees')
            ->assertOk()
            ->assertJsonPath('data.primary_entity.slug', 'healthcare')
            ->assertJsonPath('data.secondary_entity.slug', 'ai-bees');
    }

    public function test_a_non_curated_pair_of_otherwise_valid_slugs_404s(): void
    {
        // Both energy-utilities and talent-bees are real, published, valid
        // slugs — but no page was curated for this specific combination.
        $this->getJson('/api/v1/pages/resolve?path=/industries/energy-utilities/talent-bees')
            ->assertNotFound();

        $this->getJson('/api/v1/pages/resolve?path=/regions/usa/energy-bees')
            ->assertNotFound();
    }
}
