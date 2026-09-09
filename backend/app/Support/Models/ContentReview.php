<?php

namespace App\Support\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;

/**
 * One entry in a content entity's review/approval trail (P2-2). Written by
 * {@see \App\Support\Workflow\WorkflowStateMachine} on every person-performed
 * transition — submit, approve, reject, schedule, publish, unpublish, archive.
 *
 * (The legacy `cycle` column belonged to a periodic content-audit concept and
 * is left nullable for backward compatibility.)
 */
class ContentReview extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'reviewable_type',
        'reviewable_id',
        'reviewer_id',
        'cycle',
        'action',
        'from_state',
        'to_state',
        'notes',
        'reviewed_at',
    ];

    protected $casts = [
        'reviewed_at' => 'datetime',
    ];

    public function reviewable(): MorphTo
    {
        return $this->morphTo();
    }

    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewer_id');
    }
}
