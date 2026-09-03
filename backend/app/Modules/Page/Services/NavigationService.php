<?php

namespace App\Modules\Page\Services;

use App\Modules\Page\Models\NavigationItem;
use App\Modules\Page\Models\NavigationMenu;
use Illuminate\Support\Collection;

/**
 * Resolves the navigation_menus / navigation_items trees the frontend renders
 * in its layout (header, footer, mega-menus). CMS-managed, never hardcoded.
 */
final class NavigationService
{
    /**
     * All menus keyed by `key_name`, each a nested item tree.
     *
     * @return array<string, array<int, array<string, mixed>>>
     */
    public function all(): array
    {
        return NavigationMenu::query()
            ->with(['items' => fn ($q) => $q->where('is_active', true)])
            ->get()
            ->mapWithKeys(fn (NavigationMenu $menu) => [
                $menu->key_name => $this->tree($menu->items),
            ])
            ->all();
    }

    /**
     * @param  Collection<int, NavigationItem>  $items
     * @return array<int, array<string, mixed>>
     */
    private function tree(Collection $items, ?int $parentId = null): array
    {
        return $items
            ->where('parent_id', $parentId)
            ->sortBy('sort_order')
            ->map(fn (NavigationItem $item) => [
                'id' => $item->id,
                'label' => $item->label,
                'url' => $this->resolveUrl($item),
                'icon' => $item->icon,
                'children' => $this->tree($items, $item->id),
            ])
            ->values()
            ->all();
    }

    private function resolveUrl(NavigationItem $item): ?string
    {
        if ($item->custom_url !== null && $item->custom_url !== '') {
            return $item->custom_url;
        }

        // Polymorphic linkable -> slug-based path. Kept defensive: a missing
        // target yields null rather than a broken link.
        if ($item->linkable_type === null || $item->linkable_id === null) {
            return null;
        }

        $prefixes = [
            'practice' => '/practices',
            'sub_service' => '/practices',
            'industry' => '/industries',
            'region' => '/regions',
            'technology' => '/technologies',
        ];

        $prefix = $prefixes[$item->linkable_type] ?? null;

        if ($prefix === null) {
            return null;
        }

        $model = \Illuminate\Database\Eloquent\Relations\Relation::getMorphedModel($item->linkable_type);

        $slug = $model
            ? $model::query()->whereKey($item->linkable_id)->value('slug')
            : null;

        return $slug ? "{$prefix}/{$slug}" : null;
    }
}
