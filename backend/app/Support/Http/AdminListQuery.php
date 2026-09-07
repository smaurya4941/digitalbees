<?php

namespace App\Support\Http;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;

/**
 * Shared query shaping for back-office list endpoints: `?q=` free-text search
 * across the given columns, `?status=` filter, and a whitelisted `?sort=` /
 * `?dir=`. Controllers add their own eager loads / counts before paginating.
 */
final class AdminListQuery
{
    /**
     * @param  class-string<\Illuminate\Database\Eloquent\Model>  $modelClass
     * @param  list<string>  $searchable
     * @param  list<string>  $sortable  first entry is the default
     * @return Builder<covariant \Illuminate\Database\Eloquent\Model>
     */
    public static function for(
        Request $request,
        string $modelClass,
        array $searchable,
        array $sortable = ['updated_at', 'created_at'],
    ): Builder {
        $sort = in_array($request->query('sort'), $sortable, true)
            ? (string) $request->query('sort')
            : $sortable[0];

        $dir = $request->query('dir') === 'asc' ? 'asc' : 'desc';

        return $modelClass::query()
            ->when(
                $request->filled('q') && $searchable !== [],
                fn (Builder $query) => $query->where(function (Builder $w) use ($request, $searchable): void {
                    $term = '%'.$request->string('q').'%';
                    foreach ($searchable as $column) {
                        $w->orWhere($column, 'like', $term);
                    }
                }),
            )
            ->when(
                $request->filled('status'),
                fn (Builder $query) => $query->where('status', $request->string('status')),
            )
            ->orderBy($sort, $dir);
    }

    public static function perPage(Request $request, int $default = 20, int $max = 100): int
    {
        return max(1, min($max, (int) $request->integer('per_page', $default)));
    }
}
