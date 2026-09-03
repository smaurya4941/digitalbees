<?php

namespace App\Modules\CaseStudy\Http\Resources;

use App\Modules\CaseStudy\Data\CaseStudyDetail;
use App\Modules\Industry\Http\Resources\IndustrySummaryResource;
use App\Modules\Practice\Http\Resources\PracticeSummaryResource;
use App\Modules\Region\Http\Resources\RegionSummaryResource;
use App\Modules\Technology\Http\Resources\TechnologySummaryResource;
use App\Support\Seo\SeoPayload;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * The full contract for the `case-study` template.
 *
 * @property-read CaseStudyDetail $resource
 */
class CaseStudyDetailResource extends JsonResource
{
    /** @return array<string, mixed> */
    public function toArray(Request $request): array
    {
        $detail = $this->resource;
        $study = $detail->caseStudy;

        return [
            'id' => $study->id,
            'slug' => $study->slug,
            'title' => $study->title,
            'template' => 'case-study',
            'href' => "/case-studies/{$study->slug}",

            'hero' => [
                'eyebrow' => $study->client_name ? "Case study · {$study->client_name}" : 'Case study',
                'title' => $study->title,
                'description' => $study->summary,
                'cta' => ['label' => 'Start a conversation', 'url' => '/contact'],
            ],

            'client' => [
                'name' => $study->client_name,
            ],

            'summary' => $study->summary,
            'challenge' => $study->challenge,
            'solution' => $study->solution,
            'results' => $study->results,
            'metrics' => $study->metrics ?? [],
            'published_at' => $study->published_at?->toIso8601String(),

            'practices' => PracticeSummaryResource::collection($detail->practices),
            'industries' => IndustrySummaryResource::collection($detail->industries),
            'technologies' => TechnologySummaryResource::collection($detail->technologies),
            'regions' => RegionSummaryResource::collection($detail->regions),

            'seo' => SeoPayload::for($study, [
                'title' => $study->title,
                'description' => $study->summary,
                'path' => "case-studies/{$study->slug}",
                'schema_type' => 'Article',
                'schema' => [
                    '@context' => 'https://schema.org',
                    '@type' => 'Article',
                    'headline' => $study->title,
                    'description' => $study->summary,
                    'datePublished' => $study->published_at?->toIso8601String(),
                    'publisher' => [
                        '@type' => 'Organization',
                        'name' => config('seo.organization_name'),
                    ],
                ],
            ]),
        ];
    }
}
