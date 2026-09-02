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

    /** Outgoing edges in the content graph. */
    public function relationsOut(): MorphMany
    {
        return $this->morphMany(EntityRelation::class, 'subject', 'subject_type', 'subject_id');
    }

    /**
     * Resolve related models of one type from the content graph.
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

        return $relatedClass::query()->whereIn('id', $edges)->get();
    }
}
