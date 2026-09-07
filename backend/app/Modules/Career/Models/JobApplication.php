<?php

namespace App\Modules\Career\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * A candidate's application to a {@see JobPosting} (schema.sql Module 2).
 */
class JobApplication extends Model
{
    protected $table = 'job_applications';

    protected $guarded = [];

    public function job(): BelongsTo
    {
        return $this->belongsTo(JobPosting::class, 'job_id');
    }
}
