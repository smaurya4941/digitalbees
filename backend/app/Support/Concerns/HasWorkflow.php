<?php

namespace App\Support\Concerns;

use App\Support\Enums\WorkflowState;
use App\Support\Models\ContentReview;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphMany;

/**
 * The editorial-workflow columns for a content entity (P2-2).
 *
 * `workflow_state` is the pipeline position; `status` (untouched here) stays the
 * public-visibility flag. {@see \App\Support\Workflow\WorkflowStateMachine} owns
 * every transition — models never flip `workflow_state` directly.
 */
trait HasWorkflow
{
    public function initializeHasWorkflow(): void
    {
        $this->mergeCasts([
            'workflow_state' => WorkflowState::class,
            'scheduled_for' => 'datetime',
        ]);
    }

    public static function bootHasWorkflow(): void
    {
        // New rows inherit a workflow state from their public status, so seeded
        // and directly-created published content isn't stuck in `draft`.
        static::creating(function (Model $model): void {
            if ($model->getAttribute('workflow_state') === null) {
                $model->setAttribute('workflow_state', static::deriveWorkflowState($model)->value);
            }
        });

        // The legacy status paths (the form's visibility select, the
        // ContentStatusController) still work — keep `workflow_state` in step
        // when they change `status` on their own.
        static::updating(function (Model $model): void {
            if ($model->isDirty('status') && ! $model->isDirty('workflow_state')) {
                $model->setAttribute('workflow_state', static::deriveWorkflowState($model)->value);
            }
        });
    }

    protected static function deriveWorkflowState(Model $model): WorkflowState
    {
        $status = $model->status instanceof \BackedEnum ? $model->status->value : $model->status;

        return match ($status) {
            'published', 'open' => WorkflowState::Published,
            'archived', 'closed' => WorkflowState::Archived,
            default => WorkflowState::Draft,
        };
    }

    public function reviews(): MorphMany
    {
        return $this->morphMany(ContentReview::class, 'reviewable')->orderByDesc('id');
    }

    public function workflowState(): WorkflowState
    {
        return $this->workflow_state instanceof WorkflowState
            ? $this->workflow_state
            : WorkflowState::Draft;
    }

    /** @param  Builder<static>  $query */
    public function scopeInReview(Builder $query): void
    {
        $query->where('workflow_state', WorkflowState::InReview->value);
    }

    /** @param  Builder<static>  $query */
    public function scopeScheduledDue(Builder $query): void
    {
        $query->where('workflow_state', WorkflowState::Scheduled->value)
            ->whereNotNull('scheduled_for')
            ->where('scheduled_for', '<=', now());
    }
}
