<?php

namespace App\Modules\Region\Http\Resources;

use App\Modules\Region\Models\Region;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Region
 */
class RegionSummaryResource extends JsonResource
{
    /** @return array<string, mixed> */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'slug' => $this->slug,
            'name' => $this->name,
            'iso_code' => $this->iso_code,
            'summary' => $this->summary,
            'href' => "/regions/{$this->slug}",
        ];
    }
}
