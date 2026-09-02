<?php

namespace App\Modules\Page\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * A single link in a {@see NavigationMenu} (schema.sql Module 3). Either points
 * at a `custom_url` or a polymorphic `linkable` (Practice, Industry, …).
 * Self-referencing `parent_id` gives mega-menu / dropdown structure.
 */
class NavigationItem extends Model
{
    public $timestamps = false;

    protected $guarded = [];

    protected $casts = [
        'sort_order' => 'integer',
        'is_active' => 'boolean',
    ];

    public function menu(): BelongsTo
    {
        return $this->belongsTo(NavigationMenu::class, 'navigation_menu_id');
    }

    public function parent(): BelongsTo
    {
        return $this->belongsTo(self::class, 'parent_id');
    }

    public function children(): HasMany
    {
        return $this->hasMany(self::class, 'parent_id')->orderBy('sort_order')->with('children');
    }
}
