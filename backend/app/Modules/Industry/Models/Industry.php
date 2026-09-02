<?php

namespace App\Modules\Industry\Models;

use App\Support\Concerns\IsContentEntity;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * A vertical TeamBees serves (schema.sql Module 2). Related practices,
 * technologies and case studies are resolved through the content graph
 * ({@see IsContentEntity::related()}).
 */
class Industry extends Model
{
    use IsContentEntity;
    use SoftDeletes;

    protected $table = 'industries';

    protected $guarded = [];

    protected $casts = [
        'sort_order' => 'integer',
    ];
}
