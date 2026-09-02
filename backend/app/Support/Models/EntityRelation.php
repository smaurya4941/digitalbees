<?php

namespace App\Support\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;

/**
 * The content graph (schema.sql Module 7). Every cross-entity link is a row
 * here: `subject` --relation_type--> `related`. No database foreign keys —
 * integrity is a module-service concern.
 */
class EntityRelation extends Model
{
    public const UPDATED_AT = null;

    protected $guarded = [];

    protected $casts = [
        'sort_order' => 'integer',
        'created_at' => 'datetime',
    ];

    public function subject(): MorphTo
    {
        return $this->morphTo(type: 'subject_type', id: 'subject_id');
    }

    public function related(): MorphTo
    {
        return $this->morphTo(type: 'related_type', id: 'related_id');
    }
}
