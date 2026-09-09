<?php

namespace App\Http\Controllers\Api\V1\Admin\Concerns;

use App\Support\Enums\ContentStatus;
use Illuminate\Http\Request;

/**
 * Shared publish gate for the back-office content controllers.
 *
 * Coarse access (create / update / delete) is enforced by `permission:`
 * route middleware. This adds the finer rule that only `content.publish`
 * holders may move a row *into* or *out of* the `published` state — so a
 * staff member without it can still create and edit drafts.
 */
trait GuardsPublishing
{
    protected function guardPublish(Request $request, ?string $next, ?string $current = null): void
    {
        if ($next === null || $next === $current) {
            return;
        }

        $touchesPublished = $next === ContentStatus::Published->value
            || $current === ContentStatus::Published->value;

        if ($touchesPublished && $request->user()?->cannot('content.publish')) {
            abort(403, 'Publishing content requires the content.publish permission.');
        }
    }
}
