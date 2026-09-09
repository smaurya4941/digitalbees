<?php

namespace Tests\Feature\API;

use App\Models\User;
use App\Modules\Page\Models\NavigationMenu;
use Database\Seeders\NavigationSeeder;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Queue;
use Tests\TestCase;

class NavigationAdminTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Queue::fake();
        $this->seed([RoleSeeder::class, NavigationSeeder::class]);
    }

    private function user(string $role): User
    {
        $user = User::factory()->create();
        $user->syncRoles([$role]);

        return $user;
    }

    public function test_navigation_update_is_permission_gated(): void
    {
        $this->actingAs($this->user('seo-manager'))->getJson('/api/v1/admin/navigation')->assertForbidden();
        $this->actingAs($this->user('staff'))->getJson('/api/v1/admin/navigation')->assertOk();
    }

    public function test_a_menu_tree_can_be_replaced(): void
    {
        $menu = NavigationMenu::where('key_name', 'header')->firstOrFail();

        $this->actingAs($this->user('staff'))->putJson('/api/v1/admin/navigation/header', [
            'items' => [
                [
                    'label' => 'Practices',
                    'url' => '/practices',
                    'is_active' => true,
                    'children' => [
                        ['label' => 'AI Bees', 'url' => '/practices/ai-bees', 'is_active' => true],
                    ],
                ],
                ['label' => 'Contact', 'url' => '/contact', 'is_active' => true],
            ],
        ])->assertOk();

        $this->assertDatabaseHas('navigation_items', [
            'navigation_menu_id' => $menu->id,
            'label' => 'AI Bees',
            'custom_url' => '/practices/ai-bees',
        ]);

        // The whole menu was replaced — exactly 3 items remain (2 top-level + 1 child).
        $this->assertSame(3, $menu->items()->count());
    }

    public function test_unknown_menu_is_404(): void
    {
        $this->actingAs($this->user('admin'))
            ->putJson('/api/v1/admin/navigation/does-not-exist', ['items' => []])
            ->assertNotFound();
    }

    public function test_the_public_navigation_endpoint_reflects_edits(): void
    {
        $this->actingAs($this->user('staff'))->putJson('/api/v1/admin/navigation/footer', [
            'items' => [['label' => 'Privacy', 'url' => '/privacy', 'is_active' => true]],
        ])->assertOk();

        $this->getJson('/api/v1/navigation')
            ->assertOk()
            ->assertJsonPath('data.footer.0.label', 'Privacy');
    }
}
