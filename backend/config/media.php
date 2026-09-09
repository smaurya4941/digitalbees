<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Media disk
    |--------------------------------------------------------------------------
    |
    | Filesystem disk the media library reads and writes. Defaults to the
    | app-wide FILESYSTEM_DISK, falling back to the public disk for local dev.
    | Point MEDIA_DISK at an S3-compatible disk in production.
    |
    */

    'disk' => env('MEDIA_DISK', env('FILESYSTEM_DISK', 'public')),

    /*
    |--------------------------------------------------------------------------
    | Upload constraints
    |--------------------------------------------------------------------------
    |
    | max_size_kb caps the upload size. mimetypes is the allow-list enforced by
    | StoreMediaRequest. SVG is intentionally excluded — it is an active image
    | format (scripts, event handlers) and we do not sanitize it yet.
    |
    */

    'max_size_kb' => (int) env('MEDIA_MAX_SIZE_KB', 10240),

    'mimetypes' => [
        'image/jpeg',
        'image/png',
        'image/webp',
        'image/gif',
        'application/pdf',
    ],
];
