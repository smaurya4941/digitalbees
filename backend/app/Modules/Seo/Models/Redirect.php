<?php

namespace App\Modules\Seo\Models;

use App\Support\Concerns\Auditable;
use Illuminate\Database\Eloquent\Model;

/**
 * A single URL redirect served by the Next.js proxy (schema.sql Module 7).
 */
class Redirect extends Model
{
    use Auditable;

    protected $table = 'redirects';

    protected $guarded = [];

    protected $casts = [
        'status_code' => 'integer',
        'is_active' => 'boolean',
    ];
}
