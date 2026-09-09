<?php

namespace App\Modules\Resource\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Public representation — never leaks drafts or internal columns. Used for
 * both the list (excerpt only) and the detail view (`$this->detail`).
 *
 * @mixin \App\Modules\Resource\Models\Resource
 */
class ResourcePublicResource extends JsonResource
{
    public bool $detail = false;

    public function toArray(Request $request): array
    {
        $type = $this->resource_type instanceof \BackedEnum
            ? $this->resource_type->value
            : $this->resource_type;

        return array_filter([
            'title' => $this->title,
            'slug' => $this->slug,
            'resource_type' => $type,
            'excerpt' => $this->excerpt,
            'reading_time_minutes' => $this->reading_time_minutes,
            'published_at' => $this->published_at?->toIso8601String(),
            'href' => ($type === 'blog' ? '/insights/' : '/resources/').$this->slug,
            'body' => $this->when($this->detail, fn () => $this->body),
        ], fn ($v) => $v !== null);
    }

    public function asDetail(): self
    {
        $this->detail = true;

        return $this;
    }
}
