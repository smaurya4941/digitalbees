<?php

namespace App\Modules\Media\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class Media extends Model
{
    protected $table = 'assets';

    protected $fillable = [
        'name',
        'alt_text',
        'file_name',
        'mime_type',
        'size',
        'width',
        'height',
        'disk',
        'path',
        'uploaded_by',
    ];

    protected $casts = [
        'size' => 'integer',
        'width' => 'integer',
        'height' => 'integer',
        'uploaded_by' => 'integer',
    ];

    /** Public URL for this asset on its disk. */
    public function getUrlAttribute(): string
    {
        return Storage::disk($this->disk)->url($this->path);
    }

    public function uploader(): BelongsTo
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }
}
