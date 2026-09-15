<?php

namespace App\Modules\Industry\Models;

use App\Support\Concerns\Auditable;
use App\Support\Concerns\HasRevisions;
use App\Support\Concerns\HasWorkflow;
use App\Support\Concerns\IsContentEntity;
use App\Support\Search\SearchableContentEntity;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * A vertical TeamBees serves (schema.sql Module 2). Related practices,
 * technologies and case studies are resolved through the content graph
 * ({@see IsContentEntity::related()}).
 */
class Industry extends Model
{
    use Auditable;
    use HasRevisions;
    use HasWorkflow;
    use IsContentEntity;
    use SearchableContentEntity;
    use SoftDeletes;

    protected $table = 'industries';

    protected $guarded = [];

    protected $casts = [
        'sort_order' => 'integer',
    ];

    protected function searchResultType(): string
    {
        return 'industry';
    }

    protected function searchResultUrl(): string
    {
        return "/industries/{$this->slug}";
    }
}
