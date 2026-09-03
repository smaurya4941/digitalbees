<?php

namespace App\Modules\Practice\Http\Resources;

use App\Modules\CaseStudy\Http\Resources\CaseStudySummaryResource;
use App\Modules\Industry\Http\Resources\IndustrySummaryResource;
use App\Modules\Practice\Data\PracticeDetail;
use App\Modules\Region\Http\Resources\RegionSummaryResource;
use App\Modules\Technology\Http\Resources\TechnologySummaryResource;
use App\Support\Seo\SeoPayload;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * The full contract for the `practice` template — see
 * docs/architecture/api-contracts.md. The frontend receives structured data
 * only; it never learns how the DB is shaped.
 *
 * @property-read PracticeDetail $resource
 */
class PracticeDetailResource extends JsonResource
{
    /**
     * Eyebrow copy per practice. Presentation text — moves to the CMS
     * (page_sections) when the Page module lands.
     */
    private const EYEBROWS = [
        'talent-bees' => 'Talent & Staffing',
        'digital-bees' => 'Digital Transformation',
        'ai-bees' => 'AI & Automation',
        'marketing-bees' => 'Growth Marketing',
        'quality-bees' => 'Quality Engineering',
        'servicenow-bees' => 'ServiceNow',
        'energy-bees' => 'Energy Technology',
    ];

    /** @return array<string, mixed> */
    public function toArray(Request $request): array
    {
        $detail = $this->resource;
        $practice = $detail->practice;

        return [
            'id' => $practice->id,
            'slug' => $practice->slug,
            'name' => $practice->name,
            'template' => 'practice',
            'href' => "/practices/{$practice->slug}",

            'hero' => [
                'eyebrow' => self::EYEBROWS[$practice->slug] ?? 'Practice',
                'title' => $practice->tagline ?: $practice->name,
                'description' => $practice->summary,
                'cta' => ['label' => 'Start a conversation', 'url' => '/contact'],
                'secondary_cta' => ['label' => 'Explore all practices', 'url' => '/practices'],
            ],

            'proof_points' => [
                ['value' => $practice->subServices->count(), 'label' => 'Service lines'],
                ['value' => $detail->industries->count(), 'label' => 'Industries served'],
                ['value' => $detail->regions->count(), 'label' => 'Delivery regions'],
            ],

            'how_we_work' => [
                ['step' => 1, 'title' => 'Discover', 'description' => 'Assess the goal, constraints and success measures with your team.'],
                ['step' => 2, 'title' => 'Design', 'description' => 'Shape the approach, team and roadmap; de-risk the hard parts first.'],
                ['step' => 3, 'title' => 'Deliver', 'description' => 'Ship in short cycles with quality and observability built in.'],
                ['step' => 4, 'title' => 'Run', 'description' => 'Operate, measure and continually improve against outcomes.'],
            ],

            'services' => SubServiceResource::collection($practice->subServices),
            'industries' => IndustrySummaryResource::collection($detail->industries),
            'technologies' => TechnologySummaryResource::collection($detail->technologies),
            'regions' => RegionSummaryResource::collection($detail->regions),
            'case_studies' => CaseStudySummaryResource::collection($detail->caseStudies),
            'related_practices' => PracticeSummaryResource::collection($detail->relatedPractices),

            'seo' => SeoPayload::for($practice, [
                'title' => $practice->name,
                'description' => $practice->summary ?: $practice->tagline,
                'path' => "practices/{$practice->slug}",
                'schema_type' => 'Service',
                'schema' => [
                    '@context' => 'https://schema.org',
                    '@type' => 'Service',
                    'name' => $practice->name,
                    'description' => $practice->summary,
                    'provider' => [
                        '@type' => 'Organization',
                        'name' => config('seo.organization_name'),
                    ],
                ],
            ]),
        ];
    }
}
