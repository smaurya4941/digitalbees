<?php

namespace App\Modules\CaseStudy\Http\Resources;

use App\Modules\CaseStudy\Services\CaseStudyService;
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
            'results' => $this->results,
            'metrics' => $this->metrics ?? [],
            'how_it_works' => $this->how_it_works ?? [],
            'capabilities_used' => $this->capabilities_used ?? [],
            ...app(CaseStudyService::class)->relationIds($this->resource),
            'status' => $this->status,
            'published_at' => $this->published_at,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
