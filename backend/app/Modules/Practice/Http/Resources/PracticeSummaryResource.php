<?php

namespace App\Modules\Practice\Http\Resources;

use App\Modules\Practice\Models\Practice;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Compact practice shape for the hub grid and "related practices".
 *
 * @mixin Practice
 */
class PracticeSummaryResource extends JsonResource
{
    /** @return array<string, mixed> */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'slug' => $this->slug,
            'name' => $this->name,
            'tagline' => $this->tagline,
            'summary' => $this->summary,
            'icon' => $this->icon,
            'color_token' => $this->color_token,
            'href' => "/practices/{$this->slug}",
            'sub_services_count' => $this->whenCounted('sub_services'),
        ];
    }
}
