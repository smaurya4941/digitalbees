<?php

namespace App\Modules\Page\Services;

use App\Modules\CaseStudy\Repositories\Contracts\CaseStudyRepository;
use App\Modules\Industry\Models\Industry;
use App\Modules\Page\Models\Page;
use App\Modules\Practice\Models\Practice;
use App\Modules\Region\Models\Region;
use App\Support\Seo\SeoPayload;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\Relation;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

/**
 * Resolves an arbitrary published `pages` row (simple CMS pages like the
 * Company sub-pages, or curated combinatorial pages like
 * `/industries/{industry}/{practice}` and `/regions/{region}/{practice}`)
 * into everything the frontend's generic page-resolution templates need:
 * the primary (and, for combinatorial templates, secondary) entity, ordered
 * section content, a handful of related case studies, and an SEO block.
 *
 * Non-curated combinatorial URLs simply have no `pages` row and therefore
 * always resolve to a real 404 here — never a soft 404 (IA doc §5, §7).
 */
class PageResolutionService
{
    public function __construct(private readonly CaseStudyRepository $caseStudies) {}

    /** @return array<string, mixed> */
    public function resolve(string $path): array
    {
        $page = Page::with(['template', 'sections', 'seo'])
            ->where('url_path', $path)
            ->published()
            ->first();

        if (!$page) {
            throw new NotFoundHttpException("Page [{$path}] not found.");
        }

        $primary = $this->resolveEntity($page->pageable_type, $page->pageable_id);
        $secondary = $this->resolveEntity($page->secondary_type, $page->secondary_id);

        $sections = $page->sections
            ->filter(fn ($section) => $section->is_visible)
            ->mapWithKeys(fn ($section) => [$section->section_key => $section->content]);

        return [
            'id' => $page->id,
            'url_path' => $page->url_path,
            'title' => $page->title,
            'template_key' => $page->template?->key_name,
            'primary_entity' => $this->summarize($primary),
            'secondary_entity' => $this->summarize($secondary),
            'sections' => $sections,
            'case_studies' => $this->relatedCaseStudies($primary, $secondary),
            'seo' => SeoPayload::for($page, [
                'title' => $page->title ?? $this->fallbackTitle($primary, $secondary),
                'description' => $primary?->summary ?? null,
                'path' => ltrim($page->url_path, '/'),
                'schema_type' => 'CollectionPage',
                'schema' => [
                    '@context' => 'https://schema.org',
                    '@type' => 'CollectionPage',
                    'name' => $page->title,
                ],
            ]),
        ];
    }

    private function resolveEntity(?string $morphType, ?int $id): ?Model
    {
        if ($morphType === null || $id === null) {
            return null;
        }

        $class = Relation::getMorphedModel($morphType) ?? $morphType;

        if (!class_exists($class) || !method_exists($class, 'query')) {
            return null;
        }

        return $class::query()->find($id);
    }

    /** @return array<string, mixed>|null */
    private function summarize(?Model $entity): ?array
    {
        return match (true) {
            $entity instanceof Practice => (new \App\Modules\Practice\Http\Resources\PracticeSummaryResource($entity))->resolve(),
            $entity instanceof Industry => (new \App\Modules\Industry\Http\Resources\IndustrySummaryResource($entity))->resolve(),
            $entity instanceof Region => (new \App\Modules\Region\Http\Resources\RegionSummaryResource($entity))->resolve(),
            default => null,
        };
    }

    /** @return array<int, array<string, mixed>> */
    private function relatedCaseStudies(?Model $primary, ?Model $secondary): array
    {
        if (!$primary instanceof Model) {
            return [];
        }

        $subjectType = $primary->getMorphClass();
        $caseStudies = $this->caseStudies->forSubject($subjectType, (int) $primary->getKey());

        if ($secondary instanceof Model) {
            $secondaryIds = $this->caseStudies
                ->forSubject($secondary->getMorphClass(), (int) $secondary->getKey())
                ->pluck('id');

            $overlap = $caseStudies->filter(fn ($cs) => $secondaryIds->contains($cs->id));

            if ($overlap->isNotEmpty()) {
                $caseStudies = $overlap;
            }
        }

        return \App\Modules\CaseStudy\Http\Resources\CaseStudySummaryResource::collection($caseStudies->take(3))
            ->resolve();
    }

    private function fallbackTitle(?Model $primary, ?Model $secondary): ?string
    {
        $names = array_filter([$secondary->name ?? null, $primary->name ?? null]);

        return $names === [] ? null : implode(' — ', $names);
    }
}
