<?php

namespace App\Support\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;

/**
 * One immutable snapshot of a content entity (see {@see \App\Support\Concerns\HasRevisions}).
 *
 * `data` holds the entity's own columns plus meta keys prefixed with `_`
 * (`_seo`, `_relations`). Restoring replays `data` back onto the live row.
 */
class ContentRevision extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'revisionable_type',
        'revisionable_id',
        'author_id',
        'data',
        'summary',
        'created_at',
    ];

    protected $casts = [
        'data' => 'array',
        'created_at' => 'datetime',
    ];

    public function revisionable(): MorphTo
    {
        return $this->morphTo();
    }

    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    /**
     * The entity columns only — meta keys (`_seo`, `_relations`, …) stripped.
     *
     * @return array<string, mixed>
     */
    public function columns(): array
    {
        return array_filter(
            $this->data ?? [],
            static fn (string $key): bool => ! str_starts_with($key, '_'),
            ARRAY_FILTER_USE_KEY,
        );
    }

    /** @return array<string, mixed>|null */
    public function meta(string $key): ?array
    {
        return $this->data["_{$key}"] ?? null;
    }
}
