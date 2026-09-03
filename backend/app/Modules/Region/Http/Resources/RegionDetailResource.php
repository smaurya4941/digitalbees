<?php

namespace App\Modules\Region\Http\Resources;

use App\Modules\CaseStudy\Http\Resources\CaseStudySummaryResource;
use App\Modules\Practice\Http\Resources\PracticeSummaryResource;
use App\Modules\Region\Data\RegionDetail;
use App\Support\Seo\SeoPayload;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * The full contract for the `region` template.
 *
 * @property-read RegionDetail $resource
 */
class RegionDetailResource extends JsonResource
{
    /** @return array<string, mixed> */
    public function toArray(Request $request): array
    {
        $detail = $this->resource;
        $region = $detail->region;

        return [
            'id' => $region->id,
            'slug' => $region->slug,
            'name' => $region->name,
            'iso_code' => $region->iso_code,
            'template' => 'region',
            'href' => "/regions/{$region->slug}",

            'hero' => [
                'eyebrow' => 'Region',
                'title' => $region->name,
                'description' => $region->summary,
                'cta' => ['label' => 'Start a conversation', 'url' => '/contact'],
                'secondary_cta' => ['label' => 'Explore all regions', 'url' => '/regions'],
            ],

            'proof_points' => [
                ['value' => $detail->practices->count(), 'label' => 'Practices delivered here'],
                ['value' => $detail->locations->count(), 'label' => 'Locations'],
                ['value' => $detail->caseStudies->count(), 'label' => 'Case studies'],
            ],

            'practices' => PracticeSummaryResource::collection($detail->practices),
            'locations' => LocationResource::collection($detail->locations),
            'case_studies' => CaseStudySummaryResource::collection($detail->caseStudies),

            'seo' => SeoPayload::for($region, [
                'title' => $region->name,
                'description' => $region->summary,
                'path' => "regions/{$region->slug}",
                'schema_type' => 'CollectionPage',
                'schema' => [
                    '@context' => 'https://schema.org',
                    '@type' => 'CollectionPage',
                    'name' => $region->name,
                    'description' => $region->summary,
                ],
            ]),
        ];
    }
}
