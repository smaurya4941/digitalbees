<?php

namespace App\Support\Workflow;

use App\Jobs\NotifyFrontendRevalidate;
use App\Models\User;
use App\Modules\Career\Enums\JobStatus;
use App\Modules\Career\Models\JobPosting;
use App\Support\Content\ContentType;
use App\Support\Enums\WorkflowState;
use App\Support\Models\AuditLog;
use App\Support\Models\ContentReview;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Schema;

/**
 * The single authority for moving a content entity through the editorial
 * pipeline (P2-2). Every transition is permission-checked, keeps the public
 * `status` column in sync, records a {@see ContentReview} row, writes an audit
 * entry and purges the frontend cache.
 *
 * A `null` actor is the system (the scheduled-publish command) — permission
 * checks are skipped, everything else still happens.
 */
class WorkflowStateMachine
{
    /**
     * from-state => [ to-state => permission required of a human actor ]
     *
     * @var array<string, array<string, string>>
     */
    private const TRANSITIONS = [
        'draft' => [
            'in_review' => 'content.review',
            'published' => 'content.publish',
            'archived' => 'content.publish',
        ],
        'in_review' => [
            'approved' => 'content.approve',
            'draft' => 'content.approve',      // reject
        ],
        'approved' => [
            'published' => 'content.publish',
            'scheduled' => 'content.publish',
            'draft' => 'content.update',       // send back
        ],
        'scheduled' => [
            'published' => 'content.publish',
            'draft' => 'content.publish',      // cancel schedule
        ],
        'published' => [
            'archived' => 'content.publish',
            'draft' => 'content.publish',      // unpublish
        ],
        'archived' => [
            'draft' => 'content.update',
        ],
    ];

    /** @var array<string, bool> table.column => exists */
    private static array $columnCache = [];

    /**
     * The states $model may move to next, filtered to those $actor is allowed
     * to perform (all of them for the system actor).
     *
     * @return list<WorkflowState>
     */
    public function allowedTransitions(Model $model, ?User $actor): array
    {
        $from = $this->stateOf($model);
        $out = [];

        foreach (self::TRANSITIONS[$from->value] ?? [] as $to => $permission) {
            if ($actor === null || $actor->can($permission)) {
                $out[] = WorkflowState::from($to);
            }
        }

        return $out;
    }

    public function canTransition(Model $model, WorkflowState $to, ?User $actor): bool
    {
        $permission = self::TRANSITIONS[$this->stateOf($model)->value][$to->value] ?? null;

        return $permission !== null && ($actor === null || $actor->can($permission));
    }

    /**
     * @param  array{scheduled_for?: string|\DateTimeInterface|null, notes?: string|null}  $options
     *
     * @throws WorkflowTransitionException
     */
    public function transition(Model $model, WorkflowState $to, ?User $actor, array $options = []): void
    {
        $from = $this->stateOf($model);

        if ($from === $to) {
            throw WorkflowTransitionException::sameState($to);
        }

        $permission = self::TRANSITIONS[$from->value][$to->value] ?? null;

        if ($permission === null) {
            throw WorkflowTransitionException::notAllowed($from, $to);
        }

        if ($actor !== null && $actor->cannot($permission)) {
            throw WorkflowTransitionException::forbidden($permission);
        }

        $isReject = $from === WorkflowState::InReview && $to === WorkflowState::Draft;

        if ($isReject && trim((string) ($options['notes'] ?? '')) === '') {
            throw WorkflowTransitionException::notesRequired();
        }

        $scheduledFor = null;

        if ($to === WorkflowState::Scheduled) {
            $scheduledFor = $this->parseFutureDate($options['scheduled_for'] ?? null);
        }

        $this->apply($model, $from, $to, $scheduledFor);

        $this->recordReview($model, $from, $to, $actor, $options['notes'] ?? null, $isReject);

        AuditLog::record("workflow:{$to->value}", $model,
            ['workflow_state' => $from->value],
            array_filter([
                'workflow_state' => $to->value,
                'scheduled_for' => $scheduledFor?->toIso8601String(),
            ]),
        );

        if ($type = ContentType::keyFor($model)) {
            NotifyFrontendRevalidate::dispatch(ContentType::revalidationTags($type, $model->slug));
        }
    }

    private function apply(Model $model, WorkflowState $from, WorkflowState $to, ?Carbon $scheduledFor): void
    {
        $model->workflow_state = $to->value;
        $model->scheduled_for = $to === WorkflowState::Scheduled ? $scheduledFor : null;

        $model->status = $model instanceof JobPosting
            ? $this->jobStatusFor($to)->value
            : $to->toContentStatus()->value;

        if ($to === WorkflowState::Published) {
            foreach (['published_at', 'posted_at'] as $column) {
                if ($this->hasColumn($model, $column) && $model->{$column} === null) {
                    $model->{$column} = now();
                }
            }
        }

        $model->save();
    }

    private function recordReview(
        Model $model,
        WorkflowState $from,
        WorkflowState $to,
        ?User $actor,
        ?string $notes,
        bool $isReject,
    ): void {
        ContentReview::create([
            'reviewable_type' => $model->getMorphClass(),
            'reviewable_id' => $model->getKey(),
            'reviewer_id' => $actor?->id,
            'action' => $this->actionFor($from, $to, $isReject),
            'from_state' => $from->value,
            'to_state' => $to->value,
            'notes' => $notes !== null && trim($notes) !== '' ? $notes : null,
            'reviewed_at' => now(),
        ]);
    }

    private function actionFor(WorkflowState $from, WorkflowState $to, bool $isReject): string
    {
        return match (true) {
            $isReject => 'rejected',
            $to === WorkflowState::InReview => 'submitted',
            $to === WorkflowState::Approved => 'approved',
            $to === WorkflowState::Scheduled => 'scheduled',
            $to === WorkflowState::Published => 'published',
            $to === WorkflowState::Archived => 'archived',
            $to === WorkflowState::Draft => 'unpublished',
            default => 'updated',
        };
    }

    private function jobStatusFor(WorkflowState $to): JobStatus
    {
        return match ($to) {
            WorkflowState::Published => JobStatus::Open,
            WorkflowState::Archived => JobStatus::Closed,
            default => JobStatus::Draft,
        };
    }

    private function stateOf(Model $model): WorkflowState
    {
        $value = $model->workflow_state;

        if ($value instanceof WorkflowState) {
            return $value;
        }

        return $value !== null ? WorkflowState::from($value) : WorkflowState::Draft;
    }

    private function parseFutureDate(mixed $value): Carbon
    {
        if ($value === null || $value === '') {
            throw WorkflowTransitionException::scheduleRequiresDate();
        }

        try {
            $date = Carbon::parse($value);
        } catch (\Throwable) {
            throw WorkflowTransitionException::scheduleRequiresDate();
        }

        if ($date->isPast()) {
            throw WorkflowTransitionException::scheduleMustBeFuture();
        }

        return $date;
    }

    private function hasColumn(Model $model, string $column): bool
    {
        $key = $model->getTable().'.'.$column;

        return self::$columnCache[$key] ??= Schema::hasColumn($model->getTable(), $column);
    }
}
