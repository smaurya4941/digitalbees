<?php

namespace Tests\Feature\API;

use App\Modules\Company\Models\Partner;
use App\Modules\Company\Models\TeamMember;
use Database\Seeders\CompanySeeder;
use Database\Seeders\PageTemplateSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * The Company sub-pages (blueprint §26.1): Leadership and Partnerships are
 * real, fully wired endpoints that deliberately have zero seeded rows (no
 * fabricated executives or unverified partner claims — see CompanySeeder's
 * docblock) until real data is entered via the admin CMS. Our Story's
 * milestones ARE seeded, since organizational narrative copy isn't the same
 * kind of claim as inventing a named person or a third-party relationship.
 */
class CompanyApiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed([PageTemplateSeeder::class, CompanySeeder::class]);
    }

    public function test_leadership_is_wired_and_empty_by_default(): void
    {
        $this->getJson('/api/v1/company/leadership')
            ->assertOk()
            ->assertJsonPath('meta.count', 0);
    }

    public function test_leadership_returns_only_published_leadership_members(): void
    {
        TeamMember::create(['name' => 'A. Lead', 'is_leadership' => true, 'status' => 'published', 'sort_order' => 0]);
        TeamMember::create(['name' => 'B. Draft Lead', 'is_leadership' => true, 'status' => 'draft', 'sort_order' => 1]);
        TeamMember::create(['name' => 'C. Non-Leader', 'is_leadership' => false, 'status' => 'published', 'sort_order' => 2]);

        $response = $this->getJson('/api/v1/company/leadership');

        $response->assertOk();
        $names = collect($response->json('data'))->pluck('name');
        $this->assertEqualsCanonicalizing(['A. Lead'], $names->all());
    }

    public function test_partnerships_is_wired_and_empty_by_default(): void
    {
        $this->getJson('/api/v1/company/partnerships')
            ->assertOk()
            ->assertJsonPath('meta.count', 0);
    }

    public function test_partnerships_returns_only_published_partners(): void
    {
        Partner::create(['name' => 'Published Partner', 'partner_type' => 'technology', 'status' => 'published', 'sort_order' => 0]);
        Partner::create(['name' => 'Draft Partner', 'partner_type' => 'technology', 'status' => 'draft', 'sort_order' => 1]);

        $response = $this->getJson('/api/v1/company/partnerships');

        $response->assertOk();
        $names = collect($response->json('data'))->pluck('name');
        $this->assertEqualsCanonicalizing(['Published Partner'], $names->all());
    }

    public function test_our_story_returns_seeded_milestones_in_order(): void
    {
        $response = $this->getJson('/api/v1/company/our-story');

        $response->assertOk();
        $years = collect($response->json('data'))->pluck('year');
        $this->assertSame($years->sort()->values()->all(), $years->all());
        $this->assertGreaterThanOrEqual(3, $years->count());
    }

    public function test_newsroom_and_esg_pages_resolve_through_page_resolution(): void
    {
        $this->getJson('/api/v1/pages/resolve?path=/company/newsroom')
            ->assertOk()
            ->assertJsonPath('data.template_key', 'company-newsroom');

        $this->getJson('/api/v1/pages/resolve?path=/company/esg')
            ->assertOk()
            ->assertJsonPath('data.template_key', 'company-esg');
    }
}
