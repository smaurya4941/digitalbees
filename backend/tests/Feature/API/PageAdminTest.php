<?php

namespace Tests\Feature\API;

use App\Models\User;
use App\Modules\Page\Models\Page;
use App\Modules\Page\Models\PageSection;
use App\Modules\Page\Models\PageTemplate;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Queue;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class PageAdminTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Queue::fake();
        $this->seed(RoleSeeder::class);
    }

    private function user(string $role): User
    {
        $user = User::factory()->create();
        $user->syncRoles([$role]);

        return $user;
    }

    private function page(): Page
    {
        $template = PageTemplate::create([
            'key_name' => 'about',
            'blade_view' => 'about',
            'description' => 'About',
        ]);

        $page = Page::create([
            'url_path' => '/about',
            'page_template_id' => $template->id,
            'title' => 'About',
            'status' => 'draft',
        ]);

        PageSection::create([
            'page_id' => $page->id,
            'section_key' => 'hero',
            'content' => ['title' => 'Original'],
        ]);

        return $page;
    }

    public function test_index_and_show_require_authentication(): void
    {
        $this->getJson('/api/v1/admin/pages')->assertUnauthorized();
    }

    public function test_staff_can_edit_a_page_and_its_sections(): void
    {
        $page = $this->page();

        $this->actingAs($this->user('staff'))
            ->patchJson("/api/v1/admin/pages/{$page->id}", [
                'title' => 'About Us',
                'sections' => ['hero' => ['title' => 'Updated']],
            ])
            ->assertOk()
            ->assertJsonPath('data.title', 'About Us')
            ->assertJsonPath('data.sections.hero.title', 'Updated');

        $this->assertDatabaseHas('page_sections', [
            'page_id' => $page->id,
            'section_key' => 'hero',
        ]);
    }

    public function test_publishing_a_page_requires_content_publish(): void
    {
        Role::findByName('staff')->revokePermissionTo('content.publish');
        app(\Spatie\Permission\PermissionRegistrar::class)->forgetCachedPermissions();

        $page = $this->page();

        $this->actingAs($this->user('staff'))
            ->patchJson("/api/v1/admin/pages/{$page->id}", ['status' => 'published'])
            ->assertForbidden();

        $this->actingAs($this->user('admin'))
            ->patchJson("/api/v1/admin/pages/{$page->id}", ['status' => 'published'])
            ->assertOk()
            ->assertJsonPath('data.status', 'published');

        $this->assertNotNull($page->refresh()->published_at);
    }

    public function test_index_uses_the_page_envelope(): void
    {
        $this->page();

        $this->actingAs($this->user('admin'))->getJson('/api/v1/admin/pages')
            ->assertOk()
            ->assertJsonStructure([
                'data' => [['id', 'url_path', 'title', 'status', 'template']],
                'meta' => ['current_page', 'last_page', 'per_page', 'total'],
            ]);
    }
}
