<?php

namespace App\Modules\Practice\Models;

use App\Modules\Faq\Models\Faq;
use App\Support\Concerns\Auditable;
use App\Support\Concerns\IsContentEntity;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * A capability inside a practice (schema.sql Module 2). `slug` is unique only
 * within its parent practice, so route binding is scoped in the controller.
 */
class SubService extends Model
{
    use Auditable;
    use IsContentEntity;
    use SoftDeletes;

    protected $guarded = [];

    protected $casts = [
        'sort_order' => 'integer',
        'practice_id' => 'integer',
        'whats_included' => 'array',
    ];

    public function practice(): BelongsTo
    {
        return $this->belongsTo(Practice::class);
    }

    public function faqs(): MorphMany
    {
        return $this->morphMany(Faq::class, 'faqable');
    }
}
