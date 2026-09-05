<?php

namespace App\Modules\Practice\Http\Resources;

use App\Modules\Practice\Models\Practice;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Full practice row for the back-office (every field + status + timestamps).
 * Distinct from the public {@see PracticeSummaryResource}, which never leaks
 * drafts or internal columns.
 *
 * @mixin Practice
 */
class PracticeAdminResource extends JsonResource
{
    /** @return array<string, mixed> */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'tagline' => $this->tagline,
            'summary' => $this->summary,
            'icon' => $this->icon,
            'color_token' => $this->color_token,
            'sort_order' => $this->sort_order,
            'status' => $this->status instanceof \App\Support\Enums\ContentStatus
                ? $this->status->value
                : $this->status,
            'sub_services_count' => $this->whenCounted('sub_services'),
            'href' => "/practices/{$this->slug}",
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
