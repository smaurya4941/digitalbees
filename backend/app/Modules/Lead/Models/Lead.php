<?php

namespace App\Modules\Lead\Models;

use Illuminate\Database\Eloquent\Model;

class Lead extends Model
{
    protected $table = 'leads';

    protected $fillable = [
        'source_page_id',
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
}
