<?php

namespace App\Modules\Technology\Models;

use App\Support\Concerns\IsContentEntity;
use Illuminate\Database\Eloquent\Model;

/**
 * A platform / tool TeamBees delivers on (schema.sql Module 2). Independent
 * entity used heavily for SEO and internal linking.
 */
class Technology extends Model
{
    use IsContentEntity;

    protected $table = 'technologies';

    protected $guarded = [];

    protected $casts = [
        'sort_order' => 'integer',
    ];
}
