<?php

namespace Database\Seeders;

use App\Modules\Page\Models\NavigationItem;
use App\Modules\Page\Models\NavigationMenu;
use Illuminate\Database\Seeder;

/**
 * Header, Practices mega-menu and Footer trees — see
 * information-architecture.md §6. Idempotent: each menu is rebuilt from scratch.
 */
class NavigationSeeder extends Seeder
{
    public function run(): void
    {
        $this->menu('header', 'Primary navigation', [
            ['label' => 'Practices', 'custom_url' => '/practices'],
            ['label' => 'Industries', 'custom_url' => '/industries'],
            ['label' => 'Technologies', 'custom_url' => '/technologies'],
            ['label' => 'Regions', 'custom_url' => '/regions'],
            ['label' => 'Case Studies', 'custom_url' => '/case-studies'],
            ['label' => 'Insights', 'custom_url' => '/insights'],
            ['label' => 'Careers', 'custom_url' => '/careers'],
            ['label' => 'About', 'custom_url' => '/about'],
        ]);

        $this->menu('mega-practices', 'Practices mega menu', [
            ['label' => 'Talent Bees', 'custom_url' => '/practices/talent-bees'],
            ['label' => 'Digital Bees', 'custom_url' => '/practices/digital-bees'],
            ['label' => 'AI Bees', 'custom_url' => '/practices/ai-bees'],
            ['label' => 'Marketing Bees', 'custom_url' => '/practices/marketing-bees'],
            ['label' => 'Quality Bees', 'custom_url' => '/practices/quality-bees'],
            ['label' => 'ServiceNow Bees', 'custom_url' => '/practices/servicenow-bees'],
            ['label' => 'Energy Bees', 'custom_url' => '/practices/energy-bees'],
            ['label' => 'View all practices', 'custom_url' => '/practices', 'icon' => 'arrow-right'],
        ]);

        $this->menu('footer', 'Footer navigation', [
            ['label' => 'Explore', 'custom_url' => null, 'children' => [
                ['label' => 'Industries', 'custom_url' => '/industries'],
                ['label' => 'Technologies', 'custom_url' => '/technologies'],
                ['label' => 'Regions', 'custom_url' => '/regions'],
                ['label' => 'Case Studies', 'custom_url' => '/case-studies'],
                ['label' => 'Locations', 'custom_url' => '/locations'],
            ]],
            ['label' => 'Company', 'custom_url' => null, 'children' => [
                ['label' => 'About', 'custom_url' => '/about'],
                ['label' => 'Careers', 'custom_url' => '/careers'],
                ['label' => 'Insights', 'custom_url' => '/insights'],
                ['label' => 'Privacy', 'custom_url' => '/privacy'],
                ['label' => 'Terms', 'custom_url' => '/terms'],
            ]],
            ['label' => 'Practices', 'custom_url' => null, 'children' => [
                ['label' => 'Talent Bees', 'custom_url' => '/practices/talent-bees'],
                ['label' => 'Digital Bees', 'custom_url' => '/practices/digital-bees'],
                ['label' => 'AI Bees', 'custom_url' => '/practices/ai-bees'],
                ['label' => 'ServiceNow Bees', 'custom_url' => '/practices/servicenow-bees'],
                ['label' => 'Energy Bees', 'custom_url' => '/practices/energy-bees'],
            ]],
            ['label' => 'Connect', 'custom_url' => null, 'children' => [
                ['label' => 'Contact', 'custom_url' => '/contact'],
                ['label' => 'LinkedIn', 'custom_url' => 'https://www.linkedin.com/company/teambees'],
                ['label' => 'X / Twitter', 'custom_url' => 'https://x.com/teambees'],
            ]],
        ]);
    }

    /** @param  list<array<string, mixed>>  $items */
    private function menu(string $key, string $label, array $items): void
    {
        $menu = NavigationMenu::updateOrCreate(['key_name' => $key], ['label' => $label]);
        $menu->items()->delete();

        $this->createItems($menu, $items);
    }

    /**
     * @param  list<array<string, mixed>>  $items
     */
    private function createItems(NavigationMenu $menu, array $items, ?int $parentId = null): void
    {
        foreach ($items as $order => $item) {
            $children = $item['children'] ?? [];

            $row = NavigationItem::create([
                'navigation_menu_id' => $menu->id,
                'parent_id' => $parentId,
                'label' => $item['label'],
                'custom_url' => $item['custom_url'] ?? null,
                'icon' => $item['icon'] ?? null,
                'sort_order' => $order,
                'is_active' => true,
            ]);

            if ($children !== []) {
                $this->createItems($menu, $children, $row->id);
            }
        }
    }
}
