<?php

namespace App\Modules\Resource\Models;

use App\Modules\Resource\Enums\ResourceType;
use App\Support\Concerns\Auditable;
use App\Support\Concerns\HasRevisions;
use App\Support\Concerns\HasWorkflow;
use App\Support\Concerns\IsContentEntity;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Laravel\Scout\Searchable;

/**
 * Blog / guide / webinar / research / news article (schema.sql Module 2).
 * `resource_type = blog` is the public blog, served at /blog/{slug}.
 */
class Resource extends Model
{
    use Auditable;
    use HasRevisions;
    use HasWorkflow;
    use IsContentEntity;
    use Searchable;
    use SoftDeletes;

    /** Average adult reading speed used for the auto-calculated reading time. */
    public const WORDS_PER_MINUTE = 220;

    protected $guarded = [];

    protected $casts = [
        'resource_type' => ResourceType::class,
        'reading_time_minutes' => 'integer',
        'published_at' => 'datetime',
        'tags' => 'array',
        'is_featured' => 'boolean',
    ];

    /** @return BelongsTo<BlogCategory, $this> */
    public function category(): BelongsTo
    {
        return $this->belongsTo(BlogCategory::class, 'blog_category_id');
    }

    /** @param  Builder<static>  $query */
    public function scopeBlog(Builder $query): void
    {
        $query->where('resource_type', ResourceType::Blog->value);
    }

    public function isBlogPost(): bool
    {
        return $this->resource_type === ResourceType::Blog;
    }

    /** Public URL — blog posts live under /blog, everything else under /resources. */
    public function publicPath(): string
    {
        return ($this->isBlogPost() ? '/blog/' : '/resources/').$this->slug;
    }

    /** Reading time from the body when the editor has not set one explicitly. */
    public static function estimateReadingTime(?string $body): ?int
    {
        $words = str_word_count(strip_tags((string) $body));

        return $words === 0 ? null : max(1, (int) ceil($words / self::WORDS_PER_MINUTE));
    }

    public function searchableAs(): string
    {
        return $this->getTable();
    }

    public function shouldBeSearchable(): bool
    {
        return $this->status?->isPublic() ?? false;
    }

    /** @return array<string, mixed> Real columns only — the `database` search engine queries them directly. */
    public function toSearchableArray(): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'excerpt' => $this->excerpt,
        ];
    }

    /** @return array<string, mixed> */
    public function toSearchResult(): array
    {
        return [
            'type' => $this->isBlogPost() ? 'insight' : 'resource',
            'title' => $this->title,
            'excerpt' => $this->excerpt,
            'url' => $this->publicPath(),
        ];
    }
}
