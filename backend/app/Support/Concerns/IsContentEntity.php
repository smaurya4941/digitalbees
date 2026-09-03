<?php

namespace App\Support\Concerns;

use App\Support\Enums\ContentStatus;
use App\Support\Models\EntityRelation;
use App\Support\Models\SeoMetadata;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\Relations\MorphOne;
use Illuminate\Support\Collection;

/**
 * Shared behaviour for taxonomy / content models:
 * - `slug` is the route key (public identifier)
 * - `status` is a {@see ContentStatus} cast with a `published()` scope
 * - a polymorphic `seo` block
 * - read access to the `entity_relations` content graph
 *
 * Kept trait-based rather than a base class so models stay free to extend
 * framework bases (Authenticatable, Pivot, …) when needed.
 */
trait IsContentEntity
{
    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    public function initializeIsContentEntity(): void
    {
        $this->mergeCasts(['status' => ContentStatus::class]);
    }

    /** @param  Builder<static>  $query */
    public function scopePublished(Builder $query): void
    {
        $query->where('status', ContentStatus::Published->value);
    }

    /** @param  Builder<static>  $query */
    public function scopeOrdered(Builder $query): void
    {
        $query->orderBy('sort_order')->orderBy('id');
    }

    public function seo(): MorphOne
    {
        return $this->morphOne(SeoMetadata::class, 'seoable');
    }

    /** Outgoing edges in the content graph (this entity is the `subject`). */
    public function relationsOut(): MorphMany
    {
        return $this->morphMany(EntityRelation::class, 'subject', 'subject_type', 'subject_id');
    }

    /** Incoming edges in the content graph (this entity is the `related`). */
    public function relationsIn(): MorphMany
    {
        return $this->morphMany(EntityRelation::class, 'related', 'related_type', 'related_id');
    }

    /**
     * Resolve related models of one type by following outgoing edges
     * (`this` --relation_type--> result).
     *
     * @template TModel of \Illuminate\Database\Eloquent\Model
     *
     * @param  class-string<TModel>  $relatedClass
     * @return Collection<int, TModel>
     */
    public function related(string $relatedClass, ?string $relationType = null): Collection
    {
        $edges = $this->relationsOut()
            ->where('related_type', (new $relatedClass)->getMorphClass())
            ->when($relationType !== null, fn ($q) => $q->where('relation_type', $relationType))
            ->orderBy('sort_order')
            ->pluck('related_id');

        return $this->resolveGraph($relatedClass, $edges);
    }

    /**
     * Resolve related models of one type by following incoming edges
     * (result --relation_type--> `this`). Lets an Industry find the Practices
     * that `serve` it, a Technology find the Practices `built-with` it, etc.
     *
     * @template TModel of \Illuminate\Database\Eloquent\Model
     *
     * @param  class-string<TModel>  $subjectClass
     * @return Collection<int, TModel>
     */
    public function relatedInbound(string $subjectClass, ?string $relationType = null): Collection
    {
        $edges = $this->relationsIn()
            ->where('subject_type', (new $subjectClass)->getMorphClass())
            ->when($relationType !== null, fn ($q) => $q->where('relation_type', $relationType))
            ->orderBy('sort_order')
            ->pluck('subject_id');

        return $this->resolveGraph($subjectClass, $edges);
    }

    /**
     * @template TModel of \Illuminate\Database\Eloquent\Model
     *
     * @param  class-string<TModel>  $class
     * @param  Collection<int, int>  $ids
     * @return Collection<int, TModel>
     */
    private function resolveGraph(string $class, Collection $ids): Collection
    {
        if ($ids->isEmpty()) {
            return new Collection;
        }

        $query = $class::query()->whereIn('id', $ids);

        // Never surface draft/archived related content on the public API.
        if (method_exists($class, 'scopePublished')) {
            $query->published();
        }

        return $query->get()->sortBy(fn ($model) => $ids->search($model->getKey()))->values();
    }
}
