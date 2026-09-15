<?php

namespace App\Modules\Page\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Shapes {@see \App\Modules\Page\Services\PageResolutionService::resolve()}'s
 * already-built array for the wire — the service does the resolution work,
 * this just guarantees a stable, documented response contract.
 *
 * @mixin array<string, mixed>
 */
class PageResolutionResource extends JsonResource
{
    /** @return array<string, mixed> */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->resource['id'],
            'url_path' => $this->resource['url_path'],
            'title' => $this->resource['title'],
            'template_key' => $this->resource['template_key'],
            'primary_entity' => $this->resource['primary_entity'],
            'secondary_entity' => $this->resource['secondary_entity'],
            'sections' => $this->resource['sections'],
            'case_studies' => $this->resource['case_studies'],
            'seo' => $this->resource['seo'],
        ];
    }
}
