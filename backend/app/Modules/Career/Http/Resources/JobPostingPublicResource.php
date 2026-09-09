<?php

namespace App\Modules\Career\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin \App\Modules\Career\Models\JobPosting
 */
class JobPostingPublicResource extends JsonResource
{
    public bool $detail = false;

    public function toArray(Request $request): array
    {
        return array_filter([
            'title' => $this->title,
            'slug' => $this->slug,
            'employment_type' => $this->employment_type,
            'location' => $this->whenLoaded('location', fn () => $this->location ? array_filter([
                'name' => $this->location->name,
                'city' => $this->location->city,
                'country' => $this->location->country,
            ]) : null),
            'posted_at' => $this->posted_at?->toIso8601String(),
            'closes_at' => $this->closes_at?->toIso8601String(),
            'href' => "/careers/{$this->slug}",
            'description' => $this->when($this->detail, fn () => $this->description),
        ], fn ($v) => $v !== null);
    }

    public function asDetail(): self
    {
        $this->detail = true;

        return $this;
    }
}
