<?php

namespace App\Modules\Resource\Enums;

/**
 * The kind of resource. `blog` entries are surfaced publicly as "Insights";
 * everything else lives under "Resources".
 */
enum ResourceType: string
{
    case Blog = 'blog';
    case Guide = 'guide';
    case Webinar = 'webinar';
    case Research = 'research';
    case News = 'news';

    /** @return list<string> */
    public static function values(): array
    {
        return array_map(static fn (self $t) => $t->value, self::cases());
    }

    public function label(): string
    {
        return match ($this) {
            self::Blog => 'Blog / Insight',
            default => ucfirst($this->value),
        };
    }
}
