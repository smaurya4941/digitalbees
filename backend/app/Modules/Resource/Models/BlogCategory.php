<?php

namespace App\Modules\Resource\Models;

use App\Modules\Resource\Enums\ResourceType;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * An admin-managed blog category. Posts are `resources` rows with
 * `resource_type = blog`; deleting a category leaves its posts uncategorised.
 */
class BlogCategory extends Model
{
    protected $guarded = [];

    protected $casts = [
        'sort_order' => 'integer',
    ];

    /** @return HasMany<Resource, $this> */
    public function posts(): HasMany
    {
        return $this->hasMany(Resource::class, 'blog_category_id')
            ->where('resource_type', ResourceType::Blog->value);
    }

    /** @param  Builder<static>  $query */
    public function scopeOrdered(Builder $query): void
    {
        $query->orderBy('sort_order')->orderBy('name');
    }
}
