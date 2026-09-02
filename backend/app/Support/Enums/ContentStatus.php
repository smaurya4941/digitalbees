<?php

namespace App\Support\Enums;

/**
 * Publication lifecycle shared by every content/taxonomy entity.
 * Only `Published` rows are ever exposed through the public API.
 */
enum ContentStatus: string
{
    case Draft = 'draft';
    case Published = 'published';
    case Archived = 'archived';

    public function isPublic(): bool
    {
        return $this === self::Published;
    }

    /** @return list<string> */
    public static function values(): array
    {
        return array_map(static fn (self $c): string => $c->value, self::cases());
    }
}
