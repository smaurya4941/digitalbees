<?php

namespace App\Modules\Seo\Services;

use App\Jobs\NotifyFrontendRevalidate;
use App\Modules\Seo\Models\Redirect;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Cache;

final class RedirectService
{
    private const CACHE_KEY = 'redirects.active';

    /** @return Collection<int, array{from: string, to: string, status_code: int}> */
    public function allActive(): Collection
    {
        return Cache::rememberForever(self::CACHE_KEY, fn () => Redirect::query()
            ->where('is_active', true)
            ->orderBy('from_path')
            ->get(['from_path', 'to_path', 'status_code'])
            ->map(fn (Redirect $r) => [
                'from' => $r->from_path,
                'to' => $r->to_path,
                'status_code' => $r->status_code,
            ]));
    }

    /** @param  array<string, mixed>  $filters */
    public function paginate(array $filters, int $perPage): LengthAwarePaginator
    {
        return Redirect::query()
            ->when(
                filled($filters['q'] ?? null),
                fn ($q) => $q->where(fn ($w) => $w
                    ->where('from_path', 'like', '%'.$filters['q'].'%')
                    ->orWhere('to_path', 'like', '%'.$filters['q'].'%')),
            )
            ->orderBy('from_path')
            ->paginate($perPage);
    }

    /** @param  array<string, mixed>  $data */
    public function create(array $data): Redirect
    {
        $redirect = Redirect::create($data);
        $this->flush();

        return $redirect;
    }

    /** @param  array<string, mixed>  $data */
    public function update(Redirect $redirect, array $data): Redirect
    {
        $redirect->fill($data)->save();
        $this->flush();

        return $redirect->refresh();
    }

    public function delete(Redirect $redirect): void
    {
        $redirect->delete();
        $this->flush();
    }

    /** Create a 301 for a changed content slug, unless one already exists. */
    public function recordSlugChange(string $fromPath, string $toPath): void
    {
        if ($fromPath === $toPath || Redirect::query()->where('from_path', $fromPath)->exists()) {
            return;
        }

        Redirect::create([
            'from_path' => $fromPath,
            'to_path' => $toPath,
            'status_code' => 301,
            'is_active' => true,
        ]);
        $this->flush();
    }

    private function flush(): void
    {
        Cache::forget(self::CACHE_KEY);
        NotifyFrontendRevalidate::dispatch(['redirects']);
    }
}
