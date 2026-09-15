<?php

namespace App\Modules\Page\Models;

use App\Support\Concerns\Auditable;
use App\Support\Models\SeoMetadata;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphOne;

/**
 * Page-resolution CMS row. `pageable_*` / `secondary_*` are polymorphic
 * references (via the app-wide morph map) to the primary and, for
 * combinatorial templates (`industry-practice`, `region-practice`), the
 * secondary entity the page is about. See {@see \App\Modules\Page\Services\PageResolutionService}.
 */
class Page extends Model
{
    use Auditable;

    protected $guarded = [];

    protected $casts = [
        'published_at' => 'datetime',
    ];

    public function template(): BelongsTo
    {
        return $this->belongsTo(PageTemplate::class, 'page_template_id');
    }

    public function sections(): HasMany
    {
        return $this->hasMany(PageSection::class)->orderBy('sort_order');
    }

    public function seo(): MorphOne
    {
        return $this->morphOne(SeoMetadata::class, 'seoable');
    }

    /** @param  Builder<static>  $query */
    public function scopePublished(Builder $query): void
    {
        $query->where('status', 'published');
    }
}
