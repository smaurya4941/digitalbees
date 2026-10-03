<?php

namespace App\Modules\Company\Http\Resources;

use App\Modules\Company\Models\ClientLogo;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin ClientLogo
 */
class ClientLogoResource extends JsonResource
{
    /** @return array<string, mixed> */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            // Absolute URL or a path relative to the public site's root; null
            // means the frontend draws the logo from its own SVG set by name.
            'logo_url' => $this->logo ?: null,
        ];
    }
}
