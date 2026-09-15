<?php

namespace App\Modules\Technology\Models;

use App\Support\Concerns\Auditable;
use App\Support\Concerns\HasRevisions;
use App\Support\Concerns\HasWorkflow;
use App\Support\Concerns\IsContentEntity;
use App\Support\Search\SearchableContentEntity;
use Illuminate\Database\Eloquent\Model;

/**
 * A platform / tool TeamBees delivers on (schema.sql Module 2). Independent
 * entity used heavily for SEO and internal linking.
 */
class Technology extends Model
{
    use Auditable;
    use HasRevisions;
    use HasWorkflow;
    use IsContentEntity;
    use SearchableContentEntity;

    protected $table = 'technologies';

    protected $guarded = [];

    protected $casts = [
        'sort_order' => 'integer',
    ];

    protected function searchResultType(): string
    {
        return 'technology';
    }

    protected function searchResultUrl(): string
    {
        return "/technologies/{$this->slug}";
    }
}
