<?php

namespace App\Modules\Page\Services;

use App\Jobs\NotifyFrontendRevalidate;
use App\Modules\Page\Models\NavigationItem;
use App\Modules\Page\Models\NavigationMenu;
use Illuminate\Support\Facades\DB;

/**
 * Back-office editing of navigation menus. The public read tree is resolved by
 * {@see NavigationService}; this writes it. Menus are edited as a two-level
 * structure (top-level items + one level of children), which matches the
 * header / mega-menu / footer shape.
 */
final class NavigationAdminService
{
    /** @return array<int, array<string, mixed>> menus, each with an editable item tree */
    public function all(): array
    {
        return NavigationMenu::query()
            ->with(['items' => fn ($q) => $q->orderBy('sort_order')])
            ->orderBy('key_name')
            ->get()
            ->map(fn (NavigationMenu $menu) => [
                'key_name' => $menu->key_name,
                'label' => $menu->label,
                'items' => $this->editableTree($menu),
            ])
            ->all();
    }

    /**
     * Replace a menu's items with the supplied two-level tree.
     *
     * @param  array<int, array<string, mixed>>  $tree
     */
    public function sync(NavigationMenu $menu, array $tree): void
    {
        DB::transaction(function () use ($menu, $tree): void {
            $keep = [];

            foreach (array_values($tree) as $i => $node) {
                $parent = $this->upsertItem($menu, $node, null, $i);
                $keep[] = $parent->id;

                foreach (array_values($node['children'] ?? []) as $j => $child) {
                    $keep[] = $this->upsertItem($menu, $child, $parent->id, $j)->id;
                }
            }

            NavigationItem::query()
                ->where('navigation_menu_id', $menu->id)
                ->whereNotIn('id', $keep ?: [0])
                ->delete();
        });

        NotifyFrontendRevalidate::dispatch(['navigation']);
    }

    /** @param  array<string, mixed>  $node */
    private function upsertItem(NavigationMenu $menu, array $node, ?int $parentId, int $sort): NavigationItem
    {
        $attributes = [
            'label' => $node['label'],
            'custom_url' => ($node['url'] ?? null) ?: null,
            'parent_id' => $parentId,
            'sort_order' => $sort,
            'is_active' => (bool) ($node['is_active'] ?? true),
        ];

        $id = $node['id'] ?? null;

        $item = $id !== null
            ? NavigationItem::query()->where('navigation_menu_id', $menu->id)->find($id)
            : null;

        if ($item === null) {
            $item = new NavigationItem(['navigation_menu_id' => $menu->id]);
        }

        $item->fill($attributes)->save();

        return $item;
    }

    /** @return array<int, array<string, mixed>> */
    private function editableTree(NavigationMenu $menu): array
    {
        $items = $menu->items;

        return $items
            ->whereNull('parent_id')
            ->sortBy('sort_order')
            ->map(fn (NavigationItem $item) => [
                'id' => $item->id,
                'label' => $item->label,
                'url' => $item->custom_url,
                'is_active' => $item->is_active,
                'children' => $items
                    ->where('parent_id', $item->id)
                    ->sortBy('sort_order')
                    ->map(fn (NavigationItem $child) => [
                        'id' => $child->id,
                        'label' => $child->label,
                        'url' => $child->custom_url,
                        'is_active' => $child->is_active,
                    ])
                    ->values()
                    ->all(),
            ])
            ->values()
            ->all();
    }
}
