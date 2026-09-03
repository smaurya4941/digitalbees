<?php

namespace App\Modules\Technology\Http\Resources;

use App\Modules\CaseStudy\Http\Resources\CaseStudySummaryResource;
use App\Modules\Industry\Http\Resources\IndustrySummaryResource;
use App\Modules\Practice\Http\Resources\PracticeSummaryResource;
use App\Modules\Technology\Data\TechnologyDetail;
use App\Support\Seo\SeoPayload;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * The full contract for the `technology` template.
 *
 * @property-read TechnologyDetail $resource
 */
class TechnologyDetailResource extends JsonResource
{
    /** @return array<string, mixed> */
    public function toArray(Request $request): array
    {
        $detail = $this->resource;
        $technology = $detail->technology;

        return [
            'id' => $technology->id,
            'slug' => $technology->slug,
            'name' => $technology->name,
            'vendor_name' => $technology->vendor_name,
            'template' => 'technology',
            'href' => "/technologies/{$technology->slug}",

            'hero' => [
                'eyebrow' => 'Technology',
                'title' => $technology->name,
                'description' => $technology->summary,
                'cta' => ['label' => 'Start a conversation', 'url' => '/contact'],
                'secondary_cta' => ['label' => 'Explore all technologies', 'url' => '/technologies'],
            ],

            'proof_points' => [
                ['value' => $detail->practices->count(), 'label' => 'Practices'],
                ['value' => $detail->industries->count(), 'label' => 'Industries'],
                ['value' => $detail->caseStudies->count(), 'label' => 'Case studies'],
            ],

            'practices' => PracticeSummaryResource::collection($detail->practices),
            'industries' => IndustrySummaryResource::collection($detail->industries),
            'case_studies' => CaseStudySummaryResource::collection($detail->caseStudies),

            'seo' => SeoPayload::for($technology, [
                'title' => $technology->name,
                'description' => $technology->summary,
                'path' => "technologies/{$technology->slug}",
                'schema_type' => 'CollectionPage',
                'schema' => [
                    '@context' => 'https://schema.org',
                    '@type' => 'CollectionPage',
                    'name' => $technology->name,
                    'description' => $technology->summary,
                ],
            ]),
        ];
    }
}
