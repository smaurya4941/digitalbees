<?php

namespace App\Support\Enums;

/**
 * Back-office account lifecycle. Only `Active` accounts can authenticate.
 */
enum UserStatus: string
{
    case Active = 'active';
    case Invited = 'invited';
    case Suspended = 'suspended';

    public function label(): string
    {
        return ucfirst($this->value);
    }

    /** @return list<string> */
    public static function values(): array
    {
        return array_map(static fn (self $s): string => $s->value, self::cases());
    }
}
