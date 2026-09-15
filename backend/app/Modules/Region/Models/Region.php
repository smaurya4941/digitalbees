<?php

namespace App\Modules\Region\Models;

use App\Support\Concerns\Auditable;
use App\Support\Concerns\HasRevisions;
use App\Support\Concerns\HasWorkflow;
use App\Support\Concerns\IsContentEntity;
use App\Support\Search\SearchableContentEntity;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * A geography TeamBees operates in (schema.sql Module 2). Fixed set of six.
 */
class Region extends Model
{
    use Auditable;
    use HasRevisions;
    use HasWorkflow;
    use IsContentEntity;
    use SearchableContentEntity;

    protected $guarded = [];

    protected $casts = [
        'sort_order' => 'integer',
    ];

    public function locations(): HasMany
    {
        return $this->hasMany(Location::class);
    }

    protected function searchResultType(): string
    {
        return 'region';
    }

    protected function searchResultUrl(): string
    {
        return "/regions/{$this->slug}";
    }
}
