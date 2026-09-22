<?php

namespace App\Modules\Practice\Services;

use App\Jobs\NotifyFrontendRevalidate;
use App\Modules\CaseStudy\Services\CaseStudyService;
use App\Modules\Industry\Models\Industry;
use App\Modules\Practice\Data\PracticeDetail;
use App\Modules\Practice\Data\SubServiceDetail;
use App\Modules\Practice\Models\Practice;
use App\Modules\Practice\Models\SubService;
use App\Modules\Practice\Repositories\Contracts\PracticeRepository;
use App\Modules\Region\Models\Region;
use App\Modules\Seo\Services\SeoService;
use App\Modules\Technology\Models\Technology;
use App\Support\Enums\ContentStatus;
use App\Support\Models\EntityRelation;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

/**
 * Application use-cases for practices. Controllers call this; it orchestrates
 * the repository and the content graph and returns plain data.
 */
final class PracticeService
{
    /**
     * The content-graph edges a practice owns, keyed by the admin payload
     * field: field => [related model, relation_type]. Must match the edge
     * names the public read side follows (detailBySlug, IndustryService, …).
     */
    public const RELATIONS = [
        'industry_ids' => [Industry::class, 'serves'],
        'technology_ids' => [Technology::class, 'built-with'],
        'region_ids' => [Region::class, 'delivered-in'],
    ];

    public function __construct(
        private readonly PracticeRepository $practices,
        private readonly CaseStudyService $caseStudies,
        private readonly SeoService $seo,
    ) {}

    /** @return Collection<int, Practice> */
    public function list(): Collection
    {
        return $this->practices->allPublished();
    }

    public function detailBySlug(string $slug): ?PracticeDetail
    {
        $practice = $this->practices->findPublishedBySlug($slug);

        if ($practice === null) {
            return null;
        }

        return new PracticeDetail(
            practice: $practice,
            industries: $practice->related(Industry::class, 'serves'),
            technologies: $practice->related(Technology::class, 'built-with'),
            regions: $practice->related(Region::class, 'delivered-in'),
            relatedPractices: $this->practices->siblingsOf($practice),
            caseStudies: $this->caseStudies->forSubject($practice->getMorphClass(), $practice->id),
        );
    }

    public function subService(string $practiceSlug, string $subServiceSlug): ?SubService
    {
        return $this->practices->findPublishedSubService($practiceSlug, $subServiceSlug);
    }

    /**
     * The full contract for the `sub-service` template (blueprint §22.3):
     * the sub-service plus up to one related case study, borrowed from its
     * parent practice's case-study graph since sub-services aren't
     * individually tagged in `entity_relations`.
     */
    public function subServiceDetail(string $practiceSlug, string $subServiceSlug): ?SubServiceDetail
    {
        $subService = $this->subService($practiceSlug, $subServiceSlug);

        if ($subService === null) {
            return null;
        }

        $practice = $subService->practice;
        $caseStudies = $practice
            ? $this->caseStudies->forSubject($practice->getMorphClass(), $practice->id, 1)
            : collect();

        return new SubServiceDetail(subService: $subService, caseStudies: $caseStudies);
    }

    // --- Back-office use-cases ----------------------------------------------

    /** @return Collection<int, Practice> */
    public function listForAdmin(): Collection
    {
        return $this->practices->allForAdmin();
    }

    public function findForAdmin(string $slug): Practice
    {
        return $this->practices->findAnyBySlug($slug)
            ?? throw new NotFoundHttpException("Practice [{$slug}] not found.");
    }

    /** @param  array<string, mixed>  $attributes */
    public function create(array $attributes): Practice
    {
        [$attributes, $children] = $this->splitChildren($attributes);

        $practice = DB::transaction(function () use ($attributes, $children): Practice {
            $practice = $this->practices->create($attributes);
            $this->syncChildren($practice, $children);

            return $practice;
        });

        $this->flush($practice, relationsChanged: $this->touchesRelations($children));

        return $practice;
    }

    /** @param  array<string, mixed>  $attributes */
    public function update(Practice $practice, array $attributes): Practice
    {
        [$attributes, $children] = $this->splitChildren($attributes);
        $previousSlug = $practice->slug;

        $practice = DB::transaction(function () use ($practice, $attributes, $children): Practice {
            $practice = $this->practices->update($practice, $attributes);
            $this->syncChildren($practice, $children);

            return $practice;
        });

        $this->flush($practice, relationsChanged: $this->touchesRelations($children), previousSlug: $previousSlug);

        return $practice;
    }

    public function delete(Practice $practice): void
    {
        $this->practices->delete($practice);
        // A deleted practice drops out of every related industry/region/technology page too.
        $this->flush($practice, relationsChanged: true);
    }

    /** @return Collection<int, Practice> Soft-deleted practices, most recently deleted first. */
    public function trashed(): Collection
    {
        return $this->practices->allTrashed();
    }

    public function restore(string $slug): Practice
    {
        $practice = $this->practices->findTrashedBySlug($slug)
            ?? throw new NotFoundHttpException("Deleted practice [{$slug}] not found.");

        $practice = $this->practices->restore($practice);
        $this->flush($practice, relationsChanged: true);

        return $practice;
    }

    /**
     * Current content-graph edges as ordered id lists, keyed like the admin payload.
     *
     * @return array<string, list<int>>
     */
    public function relationIds(Practice $practice): array
    {
        $ids = [];

        foreach (self::RELATIONS as $field => [$class, $type]) {
            $ids[$field] = $practice->relationsOut()
                ->where('related_type', (new $class)->getMorphClass())
                ->where('relation_type', $type)
                ->orderBy('sort_order')
                ->pluck('related_id')
                ->map(fn ($id) => (int) $id)
                ->all();
        }

        return $ids;
    }

    /**
     * Pull the non-column keys (child tables, graph edges) out of a payload.
     * `key_capabilities`/`workflow_steps` are the legacy JSON-column names;
     * they're stripped defensively so a stale client payload can never
     * resurrect them.
     *
     * @param  array<string, mixed>  $attributes
     * @return array{0: array<string, mixed>, 1: array<string, mixed>}
     */
    private function splitChildren(array $attributes): array
    {
        $keys = ['sub_services', 'capabilities', 'workflows', ...array_keys(self::RELATIONS)];
        $children = array_intersect_key($attributes, array_flip($keys));

        foreach ([...$keys, 'key_capabilities', 'workflow_steps'] as $key) {
            unset($attributes[$key]);
        }

        return [$attributes, $children];
    }

    /** @param  array<string, mixed>  $children */
    private function syncChildren(Practice $practice, array $children): void
    {
        if (isset($children['sub_services'])) {
            $this->syncSubServices($practice, $children['sub_services']);
        }
        if (isset($children['capabilities'])) {
            $this->syncCapabilities($practice, $children['capabilities']);
        }
        if (isset($children['workflows'])) {
            $this->syncWorkflows($practice, $children['workflows']);
        }

        foreach (self::RELATIONS as $field => [$class, $type]) {
            if (array_key_exists($field, $children)) {
                $this->syncRelation($practice, $class, $type, $children[$field] ?? []);
            }
        }
    }

    /** @param  array<string, mixed>  $children */
    private function touchesRelations(array $children): bool
    {
        return array_intersect_key($children, self::RELATIONS) !== [];
    }

    /**
     * Replace one edge type with the given ordered id list. Unknown ids are
     * dropped — the graph has no FKs, so integrity is guarded here.
     *
     * @param  class-string<\Illuminate\Database\Eloquent\Model>  $class
     * @param  array<int, int|string>  $ids
     */
    private function syncRelation(Practice $practice, string $class, string $type, array $ids): void
    {
        $morph = (new $class)->getMorphClass();
        $wanted = collect($ids)->map(fn ($id) => (int) $id)->unique()->values();
        $valid = $class::query()->whereIn('id', $wanted)->pluck('id')->map(fn ($id) => (int) $id);
        $wanted = $wanted->filter(fn (int $id) => $valid->contains($id))->values();

        $practice->relationsOut()
            ->where('related_type', $morph)
            ->where('relation_type', $type)
            ->delete();

        foreach ($wanted as $position => $id) {
            EntityRelation::query()->create([
                'subject_type' => $practice->getMorphClass(),
                'subject_id' => $practice->getKey(),
                'related_type' => $morph,
                'related_id' => $id,
                'relation_type' => $type,
                'sort_order' => $position,
                'created_at' => now(),
            ]);
        }
    }

    private function flush(Practice $practice, bool $relationsChanged = false, ?string $previousSlug = null): void
    {
        $tags = ['practices', "practice:{$practice->slug}"];

        if ($previousSlug !== null && $previousSlug !== $practice->slug) {
            $tags[] = "practice:{$previousSlug}";
        }

        foreach ($practice->subServices()->withTrashed()->pluck('slug') as $subServiceSlug) {
            $tags[] = "sub-service:{$practice->slug}:{$subServiceSlug}";
        }

        // Industry/region/technology pages list the practices linked to them.
        if ($relationsChanged) {
            array_push($tags, 'industries', 'technologies', 'regions');
        }

        NotifyFrontendRevalidate::dispatch(array_values(array_unique($tags)));
    }

    /** @param array<int, array<string, mixed>> $subServices */
    private function syncSubServices(Practice $practice, array $subServices): void
    {
        $existing = $practice->subServices()->get()->keyBy('id');
        $keptIds = [];

        foreach ($subServices as $index => $ssData) {
            $id = isset($ssData['id']) ? (int) $ssData['id'] : null;
            $payload = [
                'name' => $ssData['name'],
                'slug' => ($ssData['slug'] ?? null) ?: Str::slug($ssData['name']),
                'summary' => $ssData['summary'] ?? null,
                'body' => $ssData['body'] ?? null,
                'whats_included' => $ssData['whats_included'] ?? null,
                'status' => $ssData['status'] ?? ContentStatus::Draft->value,
                'sort_order' => $ssData['sort_order'] ?? $index,
            ];

            // Saved through the model (not a query-builder update) so the
            // audit trail and casts apply, and SEO can attach to it.
            if ($id !== null && $existing->has($id)) {
                $subService = $existing->get($id);
                $subService->fill($payload)->save();
            } else {
                $subService = $practice->subServices()->create($payload);
            }

            if (isset($ssData['seo']) && is_array($ssData['seo'])) {
                $this->seo->sync($subService, $ssData['seo']);
            }

            $keptIds[] = $subService->id;
        }

        $practice->subServices()->whereNotIn('id', $keptIds)->get()->each->delete();
    }

    /** @param array<int, array<string, mixed>> $capabilities */
    private function syncCapabilities(Practice $practice, array $capabilities): void
    {
        $existingIds = $practice->capabilities()->pluck('id')->toArray();
        $keptIds = [];

        foreach ($capabilities as $index => $data) {
            $id = $data['id'] ?? null;
            $payload = [
                'title' => $data['title'],
                'description' => $data['description'] ?? null,
                'sort_order' => $data['sort_order'] ?? $index,
            ];

            if ($id && in_array((int) $id, $existingIds, true)) {
                $practice->capabilities()->where('id', $id)->update($payload);
                $keptIds[] = (int) $id;
            } else {
                $keptIds[] = $practice->capabilities()->create($payload)->id;
            }
        }

        $toDelete = array_diff($existingIds, $keptIds);
        if (!empty($toDelete)) {
            $practice->capabilities()->whereIn('id', $toDelete)->delete();
        }
    }

    /** @param array<int, array<string, mixed>> $workflows */
    private function syncWorkflows(Practice $practice, array $workflows): void
    {
        $existingIds = $practice->workflows()->pluck('id')->toArray();
        $keptIds = [];

        foreach ($workflows as $index => $data) {
            $id = $data['id'] ?? null;
            $payload = [
                'step' => $data['step'] ?? $index + 1,
                'title' => $data['title'],
                'description' => $data['description'] ?? null,
                'sort_order' => $data['sort_order'] ?? $index,
            ];

            if ($id && in_array((int) $id, $existingIds, true)) {
                $practice->workflows()->where('id', $id)->update($payload);
                $keptIds[] = (int) $id;
            } else {
                $keptIds[] = $practice->workflows()->create($payload)->id;
            }
        }

        $toDelete = array_diff($existingIds, $keptIds);
        if (!empty($toDelete)) {
            $practice->workflows()->whereIn('id', $toDelete)->delete();
        }
    }

    public function statuses(): array
    {
        return ContentStatus::values();
    }
}
