<?php

namespace App\Modules\Company\Models;

use App\Modules\Industry\Models\Industry;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ClientLogo extends Model
{
    protected $table = 'client_logos';

    protected $guarded = [];

    protected $casts = [
        'display_order' => 'integer',
    ];

    public function industry(): BelongsTo
    {
        return $this->belongsTo(Industry::class);
    }

    public function scopePublished($query)
    {
        return $query->where('status', 'published');
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('display_order');
    }
}
