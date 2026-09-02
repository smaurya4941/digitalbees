<?php

namespace App\Modules\Practice\Models;

use App\Support\Concerns\IsContentEntity;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * A capability inside a practice (schema.sql Module 2). `slug` is unique only
 * within its parent practice, so route binding is scoped in the controller.
 */
class SubService extends Model
{
    use IsContentEntity;
    use SoftDeletes;

    protected $guarded = [];

    protected $casts = [
        'sort_order' => 'integer',
        'practice_id' => 'integer',
    ];

    public function practice(): BelongsTo
    {
        return $this->belongsTo(Practice::class);
    }
}
