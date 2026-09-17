<?php

namespace App\Modules\Lead\Models;

use App\Modules\Practice\Models\Practice;
use App\Modules\Region\Models\Region;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Lead extends Model
{
    protected $table = 'leads';

    protected $fillable = [
        'source_page_id',
        'practice_id',
        'region_id',
        'full_name',
        'email',
        'phone',
        'company',
        'message',
        'form_type',
        'utm',
        'score',
        'status',
        'crm_reference_id',
        'ip_address',
    ];

    protected $casts = [
        'utm' => 'array',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function practice(): BelongsTo
    {
        return $this->belongsTo(Practice::class);
    }

    public function region(): BelongsTo
    {
        return $this->belongsTo(Region::class);
    }

    public function activities(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(LeadActivity::class)->orderBy('created_at', 'desc');
    }
}

