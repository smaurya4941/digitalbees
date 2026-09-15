<?php

namespace App\Modules\Practice\Models;

use App\Support\Concerns\Auditable;
use App\Support\Concerns\HasRevisions;
use App\Support\Concerns\HasWorkflow;
use App\Support\Concerns\IsContentEntity;
use App\Support\Search\SearchableContentEntity;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

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
        'key_capabilities' => 'array',
        'workflow_steps' => 'array',
        'framework_stack' => 'array',
        'agent_capabilities' => 'array',
        'technical_capabilities' => 'array',
        'servicenow_fit' => 'array',
    ];

    public function subServices(): HasMany
    {
        return $this->hasMany(SubService::class);
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
