<?php

namespace App\Support\Workflow;

use App\Support\Enums\WorkflowState;
use Symfony\Component\HttpKernel\Exception\HttpException;

/**
 * Raised by {@see WorkflowStateMachine} when a transition is invalid. Extends
 * {@see HttpException} so the framework renders it as a JSON error with the
 * right status — 403 for a permission failure, 422 for everything else.
 */
class WorkflowTransitionException extends HttpException
{
    public static function sameState(WorkflowState $state): self
    {
        return new self(422, "The content is already {$state->label()}.");
    }

    public static function notAllowed(WorkflowState $from, WorkflowState $to): self
    {
        return new self(422, "Cannot move content from {$from->label()} to {$to->label()}.");
    }

    public static function forbidden(string $permission): self
    {
        return new self(403, "This transition requires the {$permission} permission.");
    }

    public static function notesRequired(): self
    {
        return new self(422, 'A note explaining the rejection is required.');
    }

    public static function scheduleRequiresDate(): self
    {
        return new self(422, 'Scheduling requires a valid publish date and time.');
    }

    public static function scheduleMustBeFuture(): self
    {
        return new self(422, 'The scheduled publish time must be in the future.');
    }
}
