<?php

namespace Tests\Feature\Content;

use App\Modules\Industry\Models\Industry;
use App\Modules\Page\Models\NavigationItem;
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
        $this->assertNotEmpty($header->items()->whereNull('parent_id')->get());

        $footer = NavigationMenu::where('key_name', 'footer')->first();
        $this->assertSame(4, $footer->rootItems()->count());

        $this->assertNavigationPointsAtRenderedRoutes();
    }

    /**
     * Navigation must never advertise a route the frontend does not render —
     * a nav link to a 404 is worse than a missing nav link. IA §6.1 lists more
     * items than this; each joins the seeder when its template ships.
     */
    private function assertNavigationPointsAtRenderedRoutes(): void
    {
        $rendered = [
            '/',
            '/practices', '/industries', '/technologies', '/regions',
            '/case-studies', '/blog', '/resources', '/careers', '/locations',
            '/how-we-work', '/contact-us', '/privacy', '/terms',
            // Company sub-pages (blueprint §26.1) — `/about-us` 301-redirects
            // to `/company/our-story` and is no longer linked from nav.
            '/company/our-story', '/company/leadership', '/company/partnerships',
            '/company/newsroom', '/company/esg',
        ];

        $internalUrls = NavigationItem::query()
            ->whereNotNull('custom_url')
            ->pluck('custom_url')
            ->filter(fn (string $url): bool => str_starts_with($url, '/'))
            ->unique();

        foreach ($internalUrls as $url) {
            // Detail routes are covered by their collection's seeded slugs.
            if (preg_match('#^/(practices|industries|regions)/[a-z0-9-]+$#', $url) === 1) {
                continue;
            }

            $this->assertContains(
                $url,
                $rendered,
                "Navigation links to [{$url}], which no frontend route renders.",
            );
        }
    }
}
