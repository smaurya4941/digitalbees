<?php

namespace App\Modules\Company\Http\Resources;

use App\Modules\Company\Models\Partner;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Partner
 */
class PartnerResource extends JsonResource
{
    /** @return array<string, mixed> */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'logo_url' => $this->whenLoaded('logo', fn () => $this->logo?->url),
            'partner_type' => $this->partner_type,
            'technology' => $this->whenLoaded('technology', fn () => $this->technology ? [
                'slug' => $this->technology->slug,
                'name' => $this->technology->name,
            ] : null),
            'url' => $this->url,
        ];
    }
}
