<?php

namespace App\Modules\Lead\Models;

use App\Modules\Page\Models\Page;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * A footer/homepage newsletter signup (blueprint §32.2, §11.4). Kept as its
 * own table — not a `Lead` row — so high-volume, low-intent signups never
 * dilute sales-lead reporting; only the CRM client is shared between the two.
 */
class NewsletterSubscriber extends Model
{
    public $timestamps = false;

    protected $fillable = ['email', 'status', 'source_page_id'];

    protected $casts = [
        'created_at' => 'datetime',
    ];

    public function sourcePage(): BelongsTo
    {
        return $this->belongsTo(Page::class, 'source_page_id');
    }
}
