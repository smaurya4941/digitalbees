<?php

namespace App\Modules\Page\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * A named menu tree (schema.sql Module 3): header, mega-practices, footer, …
 */
class NavigationMenu extends Model
{
    public $timestamps = false;

    protected $guarded = [];

    public function getRouteKeyName(): string
    {
        return 'key_name';
    }

    /** All items in the menu, flat; callers build the tree from `parent_id`. */
    public function items(): HasMany
    {
        return $this->hasMany(NavigationItem::class)->orderBy('sort_order');
    }

    /** Top-level items with their children eager-loaded. */
    public function rootItems(): HasMany
    {
        return $this->items()->whereNull('parent_id')->with('children');
    }
}
