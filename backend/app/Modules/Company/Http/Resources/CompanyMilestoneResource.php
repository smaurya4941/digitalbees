<?php

namespace App\Modules\Company\Http\Resources;

use App\Modules\Company\Models\CompanyMilestone;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin CompanyMilestone
 */
class CompanyMilestoneResource extends JsonResource
{
    /** @return array<string, mixed> */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'year' => $this->year,
            'title' => $this->title,
            'description' => $this->description,
        ];
    }
}
