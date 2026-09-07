<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Api\V1\Admin\Concerns\GuardsPublishing;
use App\Http\Controllers\Api\V1\ApiController;
use App\Jobs\NotifyFrontendRevalidate;
use App\Modules\Career\Enums\JobStatus;
use App\Modules\Career\Models\JobPosting;
use App\Support\Content\ContentType;
use App\Support\Http\ApiResponse;
use App\Support\Models\AuditLog;
use App\Support\Models\ContentRevision;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

/**
 * Version history + rollback for any registered content type (P2-1).
 *
 *   GET    admin/{type}/{slug}/revisions                 — the history list
 *   GET    admin/{type}/{slug}/revisions/{revision}      — one snapshot vs. current
 *   POST   admin/{type}/{slug}/revisions/{revision}/restore
 *
 * All three need `content.update`; a restore that changes the published state
 * additionally needs `content.publish` (checked inline). The restore save is
 * itself versioned, so history stays linear.
 */
class RevisionController extends ApiController
{
    use GuardsPublishing;

    /** Fields never shown in the diff UI — noise, not editorial content. */
    private const HIDDEN_FIELDS = ['id', 'created_at', 'updated_at', 'deleted_at', 'published_at'];

    public function index(string $type, string $slug): JsonResponse
    {
        $model = ContentType::resolve($type, $slug);

        $revisions = $model->revisions()
            ->with('author:id,name,email')
            ->limit((int) config('revisions.keep', 20))
            ->get();

        $rows = $revisions->values()->map(function (ContentRevision $revision, int $i) use ($revisions) {
            $older = $revisions->get($i + 1);

            return [
                'id' => $revision->id,
                'summary' => $revision->summary,
                'created_at' => $revision->created_at,
                'author' => $revision->author
                    ? ['id' => $revision->author->id, 'name' => $revision->author->name]
                    : null,
                'changed_fields' => $older
                    ? $this->changedFields($older->columns(), $revision->columns())
                    : array_values(array_diff(array_keys($revision->columns()), self::HIDDEN_FIELDS)),
            ];
        });

        return ApiResponse::collection($rows, ['keep' => (int) config('revisions.keep', 20)]);
    }

    public function show(string $type, string $slug, ContentRevision $revision): JsonResponse
    {
        $model = ContentType::resolve($type, $slug);
        $this->assertBelongsTo($revision, $model);

        return ApiResponse::item([
            'revision' => [
                'id' => $revision->id,
                'summary' => $revision->summary,
                'created_at' => $revision->created_at,
                'author' => $revision->loadMissing('author')->author?->only(['id', 'name']),
                'fields' => $this->presentFields($revision->columns()),
                'seo' => $revision->meta('seo'),
            ],
            'current' => [
                'fields' => $this->presentFields($model->revisionSnapshot()),
                'seo' => $model->loadMissing('seo')->getRelation('seo')?->only([
                    'meta_title', 'meta_description', 'canonical_url', 'robots',
                    'og_title', 'og_description', 'og_image_id',
                ]),
            ],
        ]);
    }

    public function restore(Request $request, string $type, string $slug, ContentRevision $revision): JsonResponse
    {
        $model = ContentType::resolve($type, $slug);
        $this->assertBelongsTo($revision, $model);

        $currentStatus = $model->status instanceof \BackedEnum ? $model->status->value : $model->status;
        $targetStatus = $revision->columns()['status'] ?? null;
        $targetStatus = is_string($targetStatus) ? $targetStatus : null;
        $currentStatus = is_string($currentStatus) ? $currentStatus : null;

        if ($model instanceof JobPosting) {
            $touchesOpen = in_array(JobStatus::Open->value, [$targetStatus, $currentStatus], true);

            if ($touchesOpen && $request->user()?->cannot('content.publish')) {
                abort(403, 'Opening or closing a role requires the content.publish permission.');
            }
        } else {
            $this->guardPublish($request, $targetStatus, $currentStatus);
        }

        $model->restoreRevision($revision);

        AuditLog::record('reverted', $model, [], [
            'revision_id' => $revision->id,
            'revision_at' => $revision->created_at?->toIso8601String(),
        ]);

        NotifyFrontendRevalidate::dispatch(ContentType::revalidationTags($type, $model->slug));

        return ApiResponse::item([
            'type' => $type,
            'slug' => $model->slug,
            'restored_from' => $revision->id,
            'fields' => $this->presentFields($model->refresh()->revisionSnapshot()),
        ]);
    }

    private function assertBelongsTo(ContentRevision $revision, Model $model): void
    {
        if ($revision->revisionable_type !== $model->getMorphClass()
            || (int) $revision->revisionable_id !== (int) $model->getKey()) {
            throw new NotFoundHttpException('Revision does not belong to this entity.');
        }
    }

    /**
     * @param  array<string, mixed>  $before
     * @param  array<string, mixed>  $after
     * @return list<string>
     */
    private function changedFields(array $before, array $after): array
    {
        $keys = array_diff(array_keys($before + $after), self::HIDDEN_FIELDS);
        $changed = [];

        foreach ($keys as $key) {
            if (($before[$key] ?? null) !== ($after[$key] ?? null)) {
                $changed[] = $key;
            }
        }

        return array_values($changed);
    }

    /**
     * @param  array<string, mixed>  $data
     * @return array<string, mixed>
     */
    private function presentFields(array $data): array
    {
        $fields = array_diff_key($data, array_flip([...self::HIDDEN_FIELDS, '_seo', '_relations']));
        ksort($fields);

        return $fields;
    }
}
