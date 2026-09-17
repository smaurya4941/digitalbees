<?php

namespace App\Modules\Practice\Models;

use App\Support\Concerns\Auditable;
use App\Support\Concerns\HasRevisions;
use App\Support\Concerns\HasWorkflow;
use App\Support\Concerns\IsContentEntity;
use App\Support\Search\SearchableContentEntity;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Modules\Faq\Models\Faq;

/**
 * One of the seven TeamBees practices (schema.sql Module 2).
 * Route key: {@see IsContentEntity} — `slug`.
 */
class Practice extends Model
{
    use Auditable;
    use HasRevisions;
    use SearchableContentEntity;
    use HasWorkflow;
    use IsContentEntity;
    use SoftDeletes;

    protected $guarded = [];

    protected $casts = [
        'sort_order' => 'integer',
        'key_stats' => 'array',
        'framework_stack' => 'array',
        'agent_capabilities' => 'array',
        'technical_capabilities' => 'array',
        'servicenow_fit' => 'array',
    ];

    public function subServices(): HasMany
    {
        return $this->hasMany(SubService::class);
    }

    public function capabilities(): HasMany
    {
        return $this->hasMany(Capability::class)->ordered();
    }

    public function workflows(): HasMany
    {
        return $this->hasMany(Workflow::class)->ordered();
    }

    public function faqs(): MorphMany
    {
        return $this->morphMany(Faq::class, 'faqable');
    }

    public function industryPages(): HasMany
    {
        return $this->hasMany(PracticeIndustryPage::class);
    }

    public function regionPages(): HasMany
    {
        return $this->hasMany(\App\Modules\Region\Models\RegionPracticePage::class);
    }


    protected function searchResultType(): string
    {
        return 'practice';
    }

    protected function searchResultUrl(): string
    {
        return "/practices/{$this->slug}";
    }
}
