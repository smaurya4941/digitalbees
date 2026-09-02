<?php

namespace Tests\Feature\Content;

use App\Modules\Industry\Models\Industry;
use App\Modules\Page\Models\NavigationMenu;
use App\Modules\Page\Models\PageTemplate;
use App\Modules\Practice\Models\Practice;
use App\Modules\Region\Models\Region;
use App\Modules\Technology\Models\Technology;
use App\Support\Enums\ContentStatus;
use Database\Seeders\NavigationSeeder;
use Database\Seeders\PageTemplateSeeder;
use Database\Seeders\PracticeSeeder;
use Database\Seeders\RegionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * Locks the Phase 1 information-architecture invariants.
 */
class TaxonomySeedTest extends TestCase
{
    use RefreshDatabase;

    public function test_the_seven_practices_are_seeded_and_published(): void
    {
        $this->seed(PracticeSeeder::class);

        $this->assertSame(7, Practice::count());
        $this->assertEqualsCanonicalizing(
            ['talent-bees', 'digital-bees', 'ai-bees', 'marketing-bees', 'quality-bees', 'servicenow-bees', 'energy-bees'],
            Practice::pluck('slug')->all(),
        );
        $this->assertTrue(Practice::query()->published()->count() === 7);
        $this->assertGreaterThanOrEqual(3, Practice::firstWhere('slug', 'ai-bees')->subServices()->count());
    }

    public function test_regions_are_the_fixed_set_of_six(): void
    {
        $this->seed(RegionSeeder::class);

        $this->assertEqualsCanonicalizing(
            ['usa', 'uk', 'europe', 'canada', 'australia', 'uae'],
            Region::pluck('slug')->all(),
        );
    }

    public function test_slug_is_the_route_key_and_status_is_an_enum(): void
    {
        $this->seed(PracticeSeeder::class);

        $practice = Practice::firstWhere('slug', 'digital-bees');

        $this->assertSame('slug', $practice->getRouteKeyName());
        $this->assertInstanceOf(ContentStatus::class, $practice->status);
        $this->assertTrue($practice->status->isPublic());
    }

    public function test_content_graph_links_resolve_across_modules(): void
    {
        $this->seed();

        $ai = Practice::firstWhere('slug', 'ai-bees');

        $this->assertNotEmpty($ai->related(Industry::class, 'serves'));
        $this->assertNotEmpty($ai->related(Technology::class, 'built-with'));
        $this->assertNotEmpty($ai->related(Region::class, 'delivered-in'));
    }

    public function test_template_matrix_and_navigation_menus_are_seeded(): void
    {
        $this->seed(PageTemplateSeeder::class);
        $this->seed(NavigationSeeder::class);

        $this->assertNotNull(PageTemplate::firstWhere('key_name', 'practice'));
        $this->assertNotNull(PageTemplate::firstWhere('key_name', 'industry-practice'));

        $header = NavigationMenu::where('key_name', 'header')->first();
        $this->assertNotNull($header);
        $this->assertSame(8, $header->items()->whereNull('parent_id')->count());

        $footer = NavigationMenu::where('key_name', 'footer')->first();
        $this->assertSame(4, $footer->rootItems()->count());
    }
}
