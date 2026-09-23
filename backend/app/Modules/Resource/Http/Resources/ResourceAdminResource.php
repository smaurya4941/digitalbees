<?php

namespace App\Modules\Resource\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin \App\Modules\Resource\Models\Resource
 */
class ResourceAdminResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'resource_type' => $this->resource_type instanceof \BackedEnum
                ? $this->resource_type->value
                : $this->resource_type,
            'blog_category_id' => $this->blog_category_id,
            'category' => $this->relationLoaded('category') && $this->category
                ? ['id' => $this->category->id, 'name' => $this->category->name, 'slug' => $this->category->slug]
                : null,
            'excerpt' => $this->excerpt,
            'body' => $this->body,
            'cover_image' => $this->cover_image,
            'cover_image_alt' => $this->cover_image_alt,
            'author_name' => $this->author_name,
            'author_role' => $this->author_role,
            'author_avatar' => $this->author_avatar,
            'tags' => array_values($this->tags ?? []),
            'is_featured' => (bool) $this->is_featured,
            'reading_time_minutes' => $this->reading_time_minutes,
            'status' => $this->status instanceof \BackedEnum ? $this->status->value : $this->status,
            'published_at' => $this->published_at?->toIso8601String(),
            'public_url' => $this->resource->publicPath(),
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
