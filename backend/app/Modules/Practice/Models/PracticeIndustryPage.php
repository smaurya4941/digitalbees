<?php

namespace App\Modules\Practice\Models;

use App\Modules\Industry\Models\Industry;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class PracticeIndustryPage extends Model
{
    use SoftDeletes;

    protected $table = 'practice_industry_pages';

    protected $guarded = [];

    protected $casts = [
        'is_published' => 'boolean',
    ];

    public function practice(): BelongsTo
    {
        return $this->belongsTo(Practice::class);
    }

    public function industry(): BelongsTo
    {
        return $this->belongsTo(Industry::class);
    }

    public function scopePublished($query)
    {
        return $query->where('is_published', true);
    }
}
