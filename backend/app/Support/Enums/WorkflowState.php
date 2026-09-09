<?php

namespace App\Support\Enums;

/**
 * The editorial pipeline a content entity moves through (P2-2).
 *
 * This is separate from {@see ContentStatus}: `status` remains the pure
 * public-visibility flag, while `workflow_state` tracks where a piece is in
 * review / approval / scheduling. Terminal states keep the two in sync —
 * `Published` ⇒ `status = published`, `Archived` ⇒ `status = archived`,
 * everything else ⇒ `status = draft`.
 */
enum WorkflowState: string
{
    case Draft = 'draft';
    case InReview = 'in_review';
    case Approved = 'approved';
    case Scheduled = 'scheduled';
    case Published = 'published';
    case Archived = 'archived';

    /** @return list<string> */
    public static function values(): array
    {
        return array_map(static fn (self $s): string => $s->value, self::cases());
    }

    /** The public {@see ContentStatus} this workflow state implies. */
    public function toContentStatus(): ContentStatus
    {
        return match ($this) {
            self::Published => ContentStatus::Published,
            self::Archived => ContentStatus::Archived,
            default => ContentStatus::Draft,
        };
    }

    public function label(): string
    {
        return match ($this) {
            self::Draft => 'Draft',
            self::InReview => 'In review',
            self::Approved => 'Approved',
            self::Scheduled => 'Scheduled',
            self::Published => 'Published',
            self::Archived => 'Archived',
        };
    }
}
