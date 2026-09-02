<?php

namespace App\Support\Enums;

/**
 * `resources.resource_type`. `Blog` surfaces publicly as "Insights";
 * the rest surface as "Resources". Filtering happens at the query layer.
 */
enum ResourceType: string
{
    case Blog = 'blog';
    case Guide = 'guide';
    case Webinar = 'webinar';
    case Research = 'research';
    case News = 'news';

    public function isInsight(): bool
    {
        return $this === self::Blog;
    }
}
