<?php

namespace App\Modules\Media\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Media extends Model
{
    protected $table = 'assets';

    protected $fillable = [
        'name',
        'file_name',
        'mime_type',
        'size',
        'disk',
        'path',
    ];

    /**
     * Get the public URL for this media item.
     */
    public function getUrlAttribute(): string
    {
        return Storage::disk($this->disk)->url($this->path);
    }
}
