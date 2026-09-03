<?php

namespace App\Modules\CaseStudy\Http\Resources;

use App\Modules\CaseStudy\Models\CaseStudy;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Compact case-study shape for grids and "related case studies".
 *
 * @mixin CaseStudy
 */
class CaseStudySummaryResource extends JsonResource
{
    /** @return array<string, mixed> */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'slug' => $this->slug,
            'title' => $this->title,
            'client_name' => $this->client_name,
            'summary' => $this->summary,
            'metrics' => $this->metrics ?? [],
            'published_at' => $this->published_at?->toIso8601String(),
            'href' => "/case-studies/{$this->slug}",
        ];
    }
}
