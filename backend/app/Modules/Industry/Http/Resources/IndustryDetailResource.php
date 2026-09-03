<?php

namespace App\Modules\Industry\Http\Resources;

use App\Modules\CaseStudy\Http\Resources\CaseStudySummaryResource;
use App\Modules\Industry\Data\IndustryDetail;
use App\Modules\Practice\Http\Resources\PracticeSummaryResource;
use App\Modules\Technology\Http\Resources\TechnologySummaryResource;
use App\Support\Seo\SeoPayload;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * The full contract for the `industry` template.
 *
 * @property-read IndustryDetail $resource
 */
class IndustryDetailResource extends JsonResource
{
    /** @return array<string, mixed> */
    public function toArray(Request $request): array
    {
        $detail = $this->resource;
        $industry = $detail->industry;

        return [
            'id' => $industry->id,
            'slug' => $industry->slug,
            'name' => $industry->name,
            'template' => 'industry',
            'href' => "/industries/{$industry->slug}",

            'hero' => [
                'eyebrow' => 'Industry',
                'title' => $industry->name,
                'description' => $industry->summary,
                'cta' => ['label' => 'Start a conversation', 'url' => '/contact'],
                'secondary_cta' => ['label' => 'Explore all industries', 'url' => '/industries'],
            ],

            'proof_points' => [
                ['value' => $detail->practices->count(), 'label' => 'Practices engaged'],
                ['value' => $detail->technologies->count(), 'label' => 'Technologies'],
                ['value' => $detail->caseStudies->count(), 'label' => 'Case studies'],
            ],

            'practices' => PracticeSummaryResource::collection($detail->practices),
            'technologies' => TechnologySummaryResource::collection($detail->technologies),
            'case_studies' => CaseStudySummaryResource::collection($detail->caseStudies),

            'seo' => SeoPayload::for($industry, [
                'title' => $industry->name,
                'description' => $industry->summary,
                'path' => "industries/{$industry->slug}",
                'schema_type' => 'CollectionPage',
                'schema' => [
                    '@context' => 'https://schema.org',
                    '@type' => 'CollectionPage',
                    'name' => $industry->name,
                    'description' => $industry->summary,
                ],
            ]),
        ];
    }
}
