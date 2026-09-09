<?php

namespace App\Modules\Career\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin \App\Modules\Career\Models\JobPosting
 */
class JobPostingAdminResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'location_id' => $this->location_id,
            'location_name' => $this->whenLoaded('location', fn () => $this->location?->name),
            'employment_type' => $this->employment_type,
            'description' => $this->description,
            'ats_external_id' => $this->ats_external_id,
            'status' => $this->status instanceof \BackedEnum ? $this->status->value : $this->status,
            'applications_count' => $this->whenCounted('applications'),
            'posted_at' => $this->posted_at?->toIso8601String(),
            'closes_at' => $this->closes_at?->toIso8601String(),
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
