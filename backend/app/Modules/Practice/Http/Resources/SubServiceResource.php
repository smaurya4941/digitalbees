<?php

namespace App\Modules\Practice\Http\Resources;

use App\Modules\Practice\Models\SubService;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin SubService
 */
class SubServiceResource extends JsonResource
{
    /** @return array<string, mixed> */
    public function toArray(Request $request): array
    {
        $practiceSlug = $this->whenLoaded('practice', fn () => $this->practice->slug);

        return [
            'id' => $this->id,
            'slug' => $this->slug,
            'name' => $this->name,
            'summary' => $this->summary,
            'body' => $this->when($this->body !== null, $this->body),
            'href' => is_string($practiceSlug)
                ? "/practices/{$practiceSlug}/{$this->slug}"
                : null,
        ];
    }
}
