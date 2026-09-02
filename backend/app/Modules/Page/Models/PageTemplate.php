<?php

namespace App\Modules\Page\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * A render template (schema.sql Module 3). `key_name` is the contract shared
 * with the frontend, which maps it to features/<domain>/components/<Key>Template.
 * `blade_view` keeps its legacy name but now stores the frontend template key.
 */
class PageTemplate extends Model
{
    public $timestamps = false;

    protected $guarded = [];

    public function getRouteKeyName(): string
    {
        return 'key_name';
    }
}
