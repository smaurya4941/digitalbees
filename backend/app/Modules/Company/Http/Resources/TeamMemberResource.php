<?php

namespace App\Modules\Company\Http\Resources;

use App\Modules\Company\Models\TeamMember;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin TeamMember
 */
class TeamMemberResource extends JsonResource
{
    /** @return array<string, mixed> */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'title' => $this->title,
            'bio' => $this->bio,
            'photo_url' => $this->whenLoaded('photo', fn () => $this->photo?->url),
            'linkedin_url' => $this->linkedin_url,
        ];
    }
}
