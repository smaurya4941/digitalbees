<?php

namespace App\Support\Http;

use Illuminate\Contracts\Pagination\CursorPaginator;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Arr;
use Illuminate\Support\Collection;

/**
 * Single place that shapes every API payload so the frontend can rely on a
 * stable `{ data, meta, links }` envelope across all v1 endpoints.
 */
final class ApiResponse
{
    /**
     * @param  array<int, mixed>|Collection<int, mixed>  $items
     */
    public static function collection(iterable $items, array $meta = []): JsonResponse
    {
        return response()->json([
            'data' => $items,
            'meta' => array_merge(['count' => is_countable($items) ? count($items) : null], $meta),
            'links' => [],
        ]);
    }

    public static function paginated(CursorPaginator $paginator): JsonResponse
    {
        return response()->json([
            'data' => $paginator->items(),
            'meta' => [
                'per_page' => $paginator->perPage(),
                'has_more' => $paginator->hasMorePages(),
            ],
            'links' => [
                'next' => $paginator->nextCursor()?->encode(),
                'prev' => $paginator->previousCursor()?->encode(),
            ],
        ]);
    }

    public static function item(mixed $resource, array $meta = []): JsonResponse
    {
        return response()->json([
            'data' => $resource,
            'meta' => (object) $meta,
        ]);
    }

    public static function accepted(array $data = []): JsonResponse
    {
        return response()->json(['data' => $data], 202);
    }

    public static function notImplemented(string $hint): JsonResponse
    {
        return response()->json([
            'data' => [],
            'meta' => ['stub' => true, 'todo' => $hint],
            'links' => [],
        ]);
    }

    /** @param array<string, mixed> $only */
    public static function only(array $source, array $keys): array
    {
        return Arr::only($source, $keys);
    }
}
