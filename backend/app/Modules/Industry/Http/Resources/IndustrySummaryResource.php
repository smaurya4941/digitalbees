<?php

namespace App\Modules\Industry\Http\Resources;

use App\Modules\Industry\Models\Industry;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Industry
 */
class IndustrySummaryResource extends JsonResource
{
    /** @return array<string, mixed> */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'slug' => $this->slug,
            'name' => $this->name,
            'summary' => $this->summary,
            'icon' => $this->icon,
            'href' => "/industries/{$this->slug}",
        ];
    }
}
