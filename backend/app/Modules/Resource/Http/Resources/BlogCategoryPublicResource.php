<?php

namespace App\Modules\Resource\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin \App\Modules\Resource\Models\BlogCategory
 */
class BlogCategoryPublicResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return array_filter([
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'description' => $this->description,
            'href' => "/blog/category/{$this->slug}",
            'post_count' => $this->published_posts_count,
        ], fn ($v) => $v !== null);
    }
}
