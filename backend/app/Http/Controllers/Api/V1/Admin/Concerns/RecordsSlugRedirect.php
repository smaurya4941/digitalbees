<?php

namespace App\Http\Controllers\Api\V1\Admin\Concerns;

use App\Modules\Seo\Services\RedirectService;

/**
 * When a content entity's public slug changes, leave a 301 behind so old
 * links and search-engine index entries keep working (IA §5 rule 2).
 */
trait RecordsSlugRedirect
{
    protected function recordSlugRedirect(string $prefix, string $oldSlug, string $newSlug): void
    {
        if ($oldSlug === $newSlug) {
            return;
        }

        app(RedirectService::class)->recordSlugChange(
            rtrim($prefix, '/')."/{$oldSlug}",
            rtrim($prefix, '/')."/{$newSlug}",
        );
    }
}
