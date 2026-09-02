<?php

namespace App\Modules\Technology\Http\Resources;

use App\Modules\Technology\Models\Technology;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Technology
 */
class TechnologySummaryResource extends JsonResource
{
    /** @return array<string, mixed> */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'slug' => $this->slug,
            'name' => $this->name,
            'summary' => $this->summary,
            'vendor_name' => $this->vendor_name,
            'href' => "/technologies/{$this->slug}",
        ];
    }
}
