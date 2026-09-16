<?php

namespace App\Modules\Practice\Http\Resources;

use App\Modules\CaseStudy\Http\Resources\CaseStudySummaryResource;
use App\Modules\Faq\Http\Resources\FaqResource;
use App\Modules\Practice\Data\SubServiceDetail;
use App\Support\Seo\SeoPayload;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * The full contract for the `sub-service` template (blueprint §22.3): a
 * leaner page than the practice hub — hero, 2 proof points, a "what's
 * included" list, one case study, and a single CTA.
 *
 * @property-read SubServiceDetail $resource
 */
class SubServiceResource extends JsonResource
{
    /** @return array<string, mixed> */
    public function toArray(Request $request): array
    {
        $detail = $this->resource;
        $subService = $detail->subService;
        $practice = $subService->practice;
        $practiceSlug = $practice?->slug;
        $practiceName = $practice?->name ?? 'this practice';
        $ctaLabel = 'Talk to '.$this->article($practiceName)." {$practiceName} Specialist";

        return [
            'id' => $subService->id,
            'slug' => $subService->slug,
            'name' => $subService->name,
            'template' => 'sub-service',
            'summary' => $subService->summary,
            'body' => $this->when($subService->body !== null, $subService->body),
            'href' => is_string($practiceSlug)
                ? "/practices/{$practiceSlug}/{$subService->slug}"
                : null,
            'practice' => $practice ? new PracticeSummaryResource($practice) : null,

            'hero' => [
                'eyebrow' => $practiceName,
                'title' => $subService->name,
                'description' => $subService->summary,
                'cta' => ['label' => $ctaLabel, 'url' => '/contact-us'],
                'secondary_cta' => is_string($practiceSlug)
                    ? ['label' => "Explore all of {$practiceName}", 'url' => "/practices/{$practiceSlug}"]
                    : null,
            ],

            'proof_points' => [
                ['value' => count($subService->whats_included ?? []), 'label' => 'What\'s included'],
                ['value' => $detail->caseStudies->count(), 'label' => 'Related case studies'],
            ],

            'whats_included' => $subService->whats_included ?? [],

            'faqs' => FaqResource::collection($subService->faqs),

            'case_study' => CaseStudySummaryResource::collection($detail->caseStudies->take(1))->resolve()[0] ?? null,

            'cta' => ['label' => $ctaLabel, 'url' => '/contact-us'],

            'seo' => SeoPayload::for($subService, [
                'title' => "{$subService->name} | {$practiceName}",
                'description' => $subService->summary,
                'path' => is_string($practiceSlug) ? "practices/{$practiceSlug}/{$subService->slug}" : '',
                'schema_type' => 'Service',
                'schema' => [
                    '@context' => 'https://schema.org',
                    '@type' => 'Service',
                    'name' => $subService->name,
                    'description' => $subService->summary,
                    'provider' => [
                        '@type' => 'Organization',
                        'name' => 'TeamBees Corp',
                    ],
                ],
            ]),
        ];
    }

    /** "a" or "an", by the first sound of $name — good enough for practice names. */
    private function article(string $name): string
    {
        return preg_match('/^[AEIOU]/i', $name) === 1 ? 'an' : 'a';
    }
}
