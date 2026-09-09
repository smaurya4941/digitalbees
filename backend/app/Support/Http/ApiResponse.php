<?php

namespace App\Support\Http;

use Illuminate\Contracts\Pagination\CursorPaginator;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
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

    /**
     * Page-number pagination envelope for back-office list endpoints. The
     * optional $transform maps each model to an array (typically an API
     * Resource's ->resolve()); extra top-level list metadata (e.g. the set of
     * valid statuses for a filter dropdown) goes in $meta.
     *
     * @param  LengthAwarePaginator<int, mixed>  $paginator
     * @param  (callable(mixed): mixed)|null  $transform
     * @param  array<string, mixed>  $meta
     */
    public static function page(LengthAwarePaginator $paginator, ?callable $transform = null, array $meta = []): JsonResponse
    {
        $items = (new Collection($paginator->items()));

        return response()->json([
            'data' => ($transform ? $items->map($transform) : $items)->values()->all(),
            'meta' => array_merge([
                'current_page' => $paginator->currentPage(),
                'last_page' => $paginator->lastPage(),
                'per_page' => $paginator->perPage(),
                'total' => $paginator->total(),
                'from' => $paginator->firstItem(),
                'to' => $paginator->lastItem(),
            ], $meta),
            'links' => [
                'prev' => $paginator->previousPageUrl(),
                'next' => $paginator->nextPageUrl(),
            ],
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
