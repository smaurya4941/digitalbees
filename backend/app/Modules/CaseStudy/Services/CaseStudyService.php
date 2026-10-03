<?php

namespace App\Modules\CaseStudy\Services;

use App\Modules\CaseStudy\Data\CaseStudyDetail;
use App\Modules\CaseStudy\Models\CaseStudy;
use App\Modules\CaseStudy\Repositories\Contracts\CaseStudyRepository;
use App\Modules\Industry\Models\Industry;
use App\Modules\Practice\Models\Practice;
use App\Modules\Region\Models\Region;
use App\Modules\Technology\Models\Technology;
use App\Support\Models\EntityRelation;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

/**
 * Application use-cases for case studies.
 */
final class CaseStudyService
{
    public function __construct(private readonly CaseStudyRepository $caseStudies) {}

    /** @return Collection<int, CaseStudy> */
    public function list(int $limit = 50): Collection
    {
        return $this->caseStudies->allPublished($limit);
    }

    public function detailBySlug(string $slug): ?CaseStudyDetail
    {
        $study = $this->caseStudies->findPublishedBySlug($slug);

        if ($study === null) {
            return null;
        }

        return new CaseStudyDetail(
            caseStudy: $study,
            practices: $study->related(Practice::class),
            industries: $study->related(Industry::class),
            technologies: $study->related(Technology::class),
            regions: $study->related(Region::class),
        );
    }

    /** @return Collection<int, CaseStudy> */
    public function forSubject(string $morphType, int $id, int $limit = 6): Collection
    {
        return $this->caseStudies->forSubject($morphType, $id, $limit);
    }

    // --- Back-office use-cases ----------------------------------------------

    /** @return Collection<int, CaseStudy> */
    public function listForAdmin(): Collection
    {
        return $this->caseStudies->allForAdmin();
    }

    public function findForAdmin(string $slug): CaseStudy
    {
        return $this->caseStudies->findAnyBySlug($slug)
            ?? throw new \Symfony\Component\HttpKernel\Exception\NotFoundHttpException("CaseStudy [{$slug}] not found.");
    }

    /**
     * Admin relation field => related model. Stored as outgoing `featured-in`
     * edges so practice/industry/technology/region pages surface the study.
     */
    public const RELATIONS = [
        'practice_ids' => Practice::class,
        'industry_ids' => Industry::class,
        'technology_ids' => Technology::class,
        'region_ids' => Region::class,
    ];

    private const RELATION_TYPE = 'featured-in';

    /** @param  array<string, mixed>  $attributes */
    public function create(array $attributes): CaseStudy
    {
        [$attributes, $relations] = $this->splitRelations($attributes);

        $caseStudy = DB::transaction(function () use ($attributes, $relations) {
            $caseStudy = $this->caseStudies->create($attributes);
            $this->syncRelations($caseStudy, $relations);

            return $caseStudy;
        });
        $this->flush($caseStudy, $relations !== []);

        return $caseStudy;
    }

    /** @param  array<string, mixed>  $attributes */
    public function update(CaseStudy $caseStudy, array $attributes): CaseStudy
    {
        [$attributes, $relations] = $this->splitRelations($attributes);

        $caseStudy = DB::transaction(function () use ($caseStudy, $attributes, $relations) {
            $caseStudy = $this->caseStudies->update($caseStudy, $attributes);
            $this->syncRelations($caseStudy, $relations);

            return $caseStudy;
        });
        $this->flush($caseStudy, $relations !== []);

        return $caseStudy;
    }

    /** Ids for each relation field, for the admin edit form. @return array<string, list<int>> */
    public function relationIds(CaseStudy $caseStudy): array
    {
        $ids = [];
        foreach (self::RELATIONS as $field => $class) {
            $ids[$field] = $caseStudy->relationsOut()
                ->where('related_type', (new $class)->getMorphClass())
                ->orderBy('sort_order')
                ->pluck('related_id')
                ->map(fn ($id) => (int) $id)
                ->all();
        }

        return $ids;
    }

    /**
     * @param  array<string, mixed>  $attributes
     * @return array{0: array<string, mixed>, 1: array<string, list<int>>}
     */
    private function splitRelations(array $attributes): array
    {
        $relations = [];
        foreach (array_keys(self::RELATIONS) as $field) {
            if (array_key_exists($field, $attributes)) {
                $relations[$field] = array_values(array_unique(array_map('intval', $attributes[$field] ?? [])));
                unset($attributes[$field]);
            }
        }

        // Steps are numbered by position so the admin never manages step numbers.
        if (isset($attributes['how_it_works']) && is_array($attributes['how_it_works'])) {
            $attributes['how_it_works'] = array_map(
                fn (array $step, int $i) => ['step' => $i + 1, 'title' => $step['title'], 'description' => $step['description'] ?? null],
                array_values($attributes['how_it_works']),
                array_keys(array_values($attributes['how_it_works'])),
            );
        }

        return [$attributes, $relations];
    }

    /** @param  array<string, list<int>>  $relations */
    private function syncRelations(CaseStudy $caseStudy, array $relations): void
    {
        foreach ($relations as $field => $ids) {
            $morph = (new (self::RELATIONS[$field]))->getMorphClass();

            // Replace every outgoing edge to this type — including seeded ones —
            // so the admin's list is the single source of truth.
            $caseStudy->relationsOut()->where('related_type', $morph)->delete();

            foreach ($ids as $position => $id) {
                EntityRelation::query()->create([
                    'subject_type' => $caseStudy->getMorphClass(),
                    'subject_id' => $caseStudy->getKey(),
                    'related_type' => $morph,
                    'related_id' => $id,
                    'relation_type' => self::RELATION_TYPE,
                    'sort_order' => $position,
                    'created_at' => now(),
                ]);
            }
        }
    }

    public function delete(CaseStudy $caseStudy): void
    {
        $this->caseStudies->delete($caseStudy);
        $this->flush($caseStudy);
    }

    private function flush(CaseStudy $caseStudy, bool $relationsChanged = false): void
    {
        $tags = ['case-studies', "case-study:{$caseStudy->slug}"];

        // Practice/industry/technology/region pages list their case studies.
        if ($relationsChanged) {
            array_push($tags, 'practices', 'industries', 'technologies', 'regions');
        }

        \App\Jobs\NotifyFrontendRevalidate::dispatch($tags);
    }

    public function statuses(): array
    {
        return \App\Support\Enums\ContentStatus::values();
    }
}
