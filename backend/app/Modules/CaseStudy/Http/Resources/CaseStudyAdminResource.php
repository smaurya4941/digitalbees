<?php

namespace App\Modules\CaseStudy\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CaseStudyAdminResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'client_name' => $this->client_name,
            'summary' => $this->summary,
            'challenge' => $this->challenge,
            'solution' => $this->solution,
            'impact' => $this->impact,
            'hero_image' => $this->hero_image,
            'status' => $this->status,
            'sort_order' => $this->sort_order,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
