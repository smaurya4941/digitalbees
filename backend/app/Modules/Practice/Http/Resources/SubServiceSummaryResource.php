<?php

namespace App\Modules\Practice\Http\Resources;

use App\Modules\Practice\Models\SubService;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Compact sub-service shape for the practice hub's service grid — plain
 * `SubService` models, not the full {@see SubServiceResource} contract (which
 * wraps a {@see \App\Modules\Practice\Data\SubServiceDetail} for the
 * standalone `/practices/{practice}/{sub-service}` page).
 *
 * @mixin SubService
 */
class SubServiceSummaryResource extends JsonResource
{
    /** @return array<string, mixed> */
    public function toArray(Request $request): array
    {
        $practiceSlug = $this->whenLoaded('practice', fn () => $this->practice->slug);

        return [
            'id' => $this->id,
            'slug' => $this->slug,
            'name' => $this->name,
            'summary' => $this->summary,
            'href' => is_string($practiceSlug)
                ? "/practices/{$practiceSlug}/{$this->slug}"
                : null,
        ];
    }
}
