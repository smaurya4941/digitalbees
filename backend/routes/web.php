<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| TeamBees runs headless: the public site is served by the Next.js app in
| ../frontend. Laravel exposes only JSON under /api. This file intentionally
| keeps just a root descriptor; the /up health check is wired in
| bootstrap/app.php.
|
*/

Route::get('/', fn () => response()->json([
    'name' => config('app.name'),
    'service' => 'teambees-backend',
    'api' => url('/api/v1'),
    'docs' => 'https://github.com/  (see /docs/api/openapi.yaml)',
]));
