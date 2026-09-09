<?php

namespace App\Modules\Region\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin \App\Modules\Region\Models\Location
 */
class LocationPublicResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return array_filter([
            'name' => $this->name,
            'slug' => $this->slug,
            'address' => $this->address,
            'city' => $this->city,
            'country' => $this->country,
            'lat' => $this->lat,
            'lng' => $this->lng,
            'region' => $this->whenLoaded('region', fn () => $this->region?->name),
            'href' => "/locations/{$this->slug}",
        ], fn ($v) => $v !== null);
    }
}
