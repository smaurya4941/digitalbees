<?php

namespace App\Modules\Career\Enums;

/**
 * Job posting lifecycle. `open` is the public state — a role is only listed on
 * the careers page while it is open.
 */
enum JobStatus: string
{
    case Draft = 'draft';
    case Open = 'open';
    case Closed = 'closed';

    /** @return list<string> */
    public static function values(): array
    {
        return array_map(static fn (self $s) => $s->value, self::cases());
    }

    public function isPublic(): bool
    {
        return $this === self::Open;
    }
}
