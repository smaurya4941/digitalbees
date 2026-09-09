<?php

namespace App\Support\Concerns;

use App\Support\Models\ContentRevision;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphMany;

/**
 * Per-entity version history (P2-1).
 *
 * A revision is recorded automatically after every authenticated save, so each
 * row in `content_revisions` is a complete, restorable snapshot of a committed
 * version — columns plus the `_seo` block. Unauthenticated saves (seeders,
 * queue jobs, the scheduled-publish command running as the system actor) are
 * never versioned.
 *
 * Restoring replays a snapshot back onto the live row; the resulting save is
 * itself versioned, so history stays linear and nothing is lost.
 *
 * Opt out of noisy columns with `protected array $revisionExclude = [...]`.
 */
trait HasRevisions
{
    public static function bootHasRevisions(): void
    {
        static::saved(function (Model $model): void {
            if (! auth()->check()) {
                return;
            }

            $meaningful = array_diff(array_keys($model->getChanges()), ['updated_at', 'created_at']);

            if (! $model->wasRecentlyCreated && $meaningful === []) {
                return;
            }

            /** @var static $model */
            $model->recordRevision();
        });
    }

    public function revisions(): MorphMany
    {
        return $this->morphMany(ContentRevision::class, 'revisionable')->orderByDesc('id');
    }

    public function recordRevision(?string $summary = null, ?int $authorId = null): ContentRevision
    {
        /** @var ContentRevision $revision */
        $revision = $this->revisions()->create([
            'author_id' => $authorId ?? auth()->id(),
            'data' => $this->revisionSnapshot(),
            'summary' => $summary,
            'created_at' => now(),
        ]);

        $this->pruneRevisions();

        return $revision;
    }

    /**
     * The restorable payload: the entity's own columns plus meta blocks under
     * `_`-prefixed keys. Models may override to add more.
     *
     * @return array<string, mixed>
     */
    public function revisionSnapshot(): array
    {
        $data = $this->revisionableColumns();

        if (method_exists($this, 'seo')) {
            $this->loadMissing('seo');

            $data['_seo'] = $this->getRelation('seo')?->only([
                'meta_title', 'meta_description', 'canonical_url', 'robots',
                'og_title', 'og_description', 'og_image_id', 'twitter_card',
                'schema_type', 'schema_json',
            ]);
        }

        return $data;
    }

    /** @return array<string, mixed> */
    protected function revisionableColumns(): array
    {
        $exclude = array_merge(
            ['id', 'created_at', 'updated_at', 'deleted_at'],
            property_exists($this, 'revisionExclude') ? $this->revisionExclude : [],
        );

        return array_diff_key($this->attributesToArray(), array_flip($exclude));
    }

    protected function pruneRevisions(): void
    {
        $keep = (int) config('revisions.keep', 20);

        if ($keep <= 0) {
            return;
        }

        $ids = $this->revisions()->orderByDesc('id')->pluck('id');

        if ($ids->count() > $keep) {
            ContentRevision::query()->whereIn('id', $ids->slice($keep)->all())->delete();
        }
    }

    /**
     * Replay a revision onto this row. The caller owns permission checks,
     * auditing and cache revalidation.
     */
    public function restoreRevision(ContentRevision $revision): void
    {
        $this->fill($revision->columns())->save();

        if (method_exists($this, 'seo') && $revision->meta('seo') !== null) {
            $this->seo()->updateOrCreate([], $revision->meta('seo'));
        }
    }
}
