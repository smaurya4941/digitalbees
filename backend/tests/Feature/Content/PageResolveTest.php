<?php

namespace Tests\Feature\Content;

use App\Modules\Page\Models\Page;
use App\Modules\Page\Models\PageTemplate;
use App\Modules\Practice\Models\Practice;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * Regression coverage for a real bug: PageController::resolve() used to call
 * ApiResponse::error(), a method that doesn't exist on ApiResponse, which
 * turned every unresolved path into an uncaught 500 instead of a 404.
 */
class PageResolveTest extends TestCase
{
    use RefreshDatabase;

    public function test_an_unknown_path_returns_a_real_404_not_a_500(): void
    {
        $response = $this->getJson('/api/v1/pages/resolve?path=/nowhere/at/all');

        $response->assertNotFound();
    }

    public function test_a_published_page_resolves_with_the_full_contract(): void
    {
        $template = PageTemplate::create([
            'key_name' => 'test-simple',
            'blade_view' => 'TestSimpleTemplate',
        ]);

        $practice = Practice::create([
            'name' => 'AI Bees',
            'slug' => 'ai-bees',
            'tagline' => 'Applied AI.',
            'summary' => 'AI delivery.',
            'status' => 'published',
            'sort_order' => 1,
        ]);

        $page = Page::create([
            'url_path' => '/test/simple-page',
            'page_template_id' => $template->id,
            'pageable_type' => 'practice',
            'pageable_id' => $practice->id,
            'title' => 'A Test Page',
            'status' => 'published',
            'published_at' => now(),
        ]);

        $page->sections()->create([
            'section_key' => 'hero',
            'content' => ['title' => 'Hello'],
            'sort_order' => 0,
            'is_visible' => true,
        ]);

        $response = $this->getJson('/api/v1/pages/resolve?path=/test/simple-page');

        $response->assertOk()
            ->assertJsonPath('data.url_path', '/test/simple-page')
            ->assertJsonPath('data.template_key', 'test-simple')
            ->assertJsonPath('data.primary_entity.slug', $practice->slug)
            ->assertJsonPath('data.sections.hero.title', 'Hello')
            ->assertJsonPath('data.seo.meta_title', fn ($title) => str_contains((string) $title, 'A Test Page'));
    }

    public function test_a_draft_page_is_not_resolvable(): void
    {
        $template = PageTemplate::create([
            'key_name' => 'test-draft',
            'blade_view' => 'TestDraftTemplate',
        ]);

        Page::create([
            'url_path' => '/test/draft-page',
            'page_template_id' => $template->id,
            'status' => 'draft',
        ]);

        $this->getJson('/api/v1/pages/resolve?path=/test/draft-page')->assertNotFound();
    }
}
