<?php

namespace App\Modules\Region\Models;

use App\Modules\Practice\Models\Practice;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class RegionPracticePage extends Model
{
    use SoftDeletes;

    protected $table = 'region_practice_pages';

    protected $guarded = [];

    protected $casts = [
        'is_published' => 'boolean',
    ];

    public function region(): BelongsTo
    {
        return $this->belongsTo(Region::class);
    }

    public function practice(): BelongsTo
    {
        return $this->belongsTo(Practice::class);
    }

    public function scopePublished($query)
    {
        return $query->where('is_published', true);
    }
}
