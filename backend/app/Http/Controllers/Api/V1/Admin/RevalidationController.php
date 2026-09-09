<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Api\V1\ApiController;
use App\Jobs\NotifyFrontendRevalidate;
use App\Support\Http\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Manual "publish now" — force the Next.js app to drop cache tags / paths.
 * Automatic revalidation already fires on every write; this is the escape
 * hatch for stale reads. Gated by `permission:content.publish`.
 */
class RevalidationController extends ApiController
{
    /** Broad tags purged by the "everything" option. */
    private const ALL_TAGS = [
        'navigation', 'settings', 'redirects',
        'practices', 'industries', 'regions', 'technologies',
        'case-studies', 'resources', 'insights', 'careers', 'locations',
    ];

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'all' => ['sometimes', 'boolean'],
            'tags' => ['sometimes', 'array'],
            'tags.*' => ['string', 'max:100'],
            'paths' => ['sometimes', 'array'],
            'paths.*' => ['string', 'max:255'],
        ]);

        $tags = ($validated['all'] ?? false)
            ? self::ALL_TAGS
            : array_values($validated['tags'] ?? []);

        $paths = array_values($validated['paths'] ?? []);

        if ($tags === [] && $paths === []) {
            abort(422, 'Provide `tags`, `paths`, or `all: true`.');
        }

        NotifyFrontendRevalidate::dispatch($tags, $paths);

        return ApiResponse::accepted(['tags' => $tags, 'paths' => $paths]);
    }
}
