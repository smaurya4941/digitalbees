<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Api\V1\ApiController;
use App\Support\Content\ContentType;
use App\Support\Enums\WorkflowState;
use App\Support\Http\ApiResponse;
use App\Support\Models\ContentReview;
use App\Support\Workflow\WorkflowStateMachine;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

/**
 * The editorial workflow surface (P2-2 / P2-3).
 *
 *   GET  admin/workflow/queue              — everything awaiting review
 *   GET  admin/{type}/{slug}/workflow      — current state + allowed moves + trail
 *   POST admin/{type}/{slug}/transition    — perform a transition
 *
 * The transition route is coarsely gated to any workflow permission; the exact
 * per-transition permission is enforced by {@see WorkflowStateMachine}.
 */
class WorkflowController extends ApiController
{
    public function __construct(private readonly WorkflowStateMachine $machine) {}

    public function queue(Request $request): JsonResponse
    {
        $rows = [];

        foreach (ContentType::keys() as $type) {
            $model = ContentType::modelClass($type);

            $model::query()
                ->where('workflow_state', WorkflowState::InReview->value)
                ->orderByDesc('updated_at')
                ->get()
                ->each(function (Model $entity) use (&$rows, $type): void {
                    $submitted = ContentReview::query()
                        ->where('reviewable_type', $entity->getMorphClass())
                        ->where('reviewable_id', $entity->getKey())
                        ->where('to_state', WorkflowState::InReview->value)
                        ->latest('id')
                        ->first();

                    $rows[] = [
                        'type' => $type,
                        'slug' => $entity->slug,
                        'title' => $entity->name ?? $entity->title ?? $entity->slug,
                        'href' => ContentType::prefix($type)."/{$entity->slug}",
                        'submitted_at' => $submitted?->reviewed_at,
                        'submitted_by' => $submitted?->reviewer()->value('name'),
                        'updated_at' => $entity->updated_at,
                    ];
                });
        }

        return ApiResponse::collection($rows, ['count' => count($rows)]);
    }

    public function show(string $type, string $slug): JsonResponse
    {
        $model = ContentType::resolve($type, $slug);
        $actor = request()->user();

        return ApiResponse::item([
            'workflow_state' => $this->stateValue($model),
            'status' => $model->status instanceof \BackedEnum ? $model->status->value : $model->status,
            'scheduled_for' => $model->scheduled_for,
            'allowed_transitions' => array_map(
                fn (WorkflowState $s) => ['to' => $s->value, 'label' => $s->label()],
                $this->machine->allowedTransitions($model, $actor),
            ),
            'reviews' => $model->reviews()->with('reviewer:id,name')->limit(15)->get()->map(fn (ContentReview $r) => [
                'action' => $r->action,
                'from_state' => $r->from_state,
                'to_state' => $r->to_state,
                'notes' => $r->notes,
                'reviewer' => $r->reviewer?->only(['id', 'name']),
                'reviewed_at' => $r->reviewed_at,
            ]),
        ]);
    }

    public function transition(Request $request, string $type, string $slug): JsonResponse
    {
        $model = ContentType::resolve($type, $slug);

        $validated = $request->validate([
            'to' => ['required', Rule::in(WorkflowState::values())],
            'scheduled_for' => ['nullable', 'date'],
            'notes' => ['nullable', 'string', 'max:2000'],
        ]);

        $this->machine->transition(
            $model,
            WorkflowState::from($validated['to']),
            $request->user(),
            [
                'scheduled_for' => $validated['scheduled_for'] ?? null,
                'notes' => $validated['notes'] ?? null,
            ],
        );

        $model->refresh();

        return ApiResponse::item([
            'type' => $type,
            'slug' => $model->slug,
            'workflow_state' => $this->stateValue($model),
            'status' => $model->status instanceof \BackedEnum ? $model->status->value : $model->status,
            'scheduled_for' => $model->scheduled_for,
            'allowed_transitions' => array_map(
                fn (WorkflowState $s) => ['to' => $s->value, 'label' => $s->label()],
                $this->machine->allowedTransitions($model, $request->user()),
            ),
        ]);
    }

    private function stateValue(Model $model): string
    {
        return $model->workflow_state instanceof WorkflowState
            ? $model->workflow_state->value
            : (string) ($model->workflow_state ?? WorkflowState::Draft->value);
    }
}
