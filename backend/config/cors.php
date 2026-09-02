<?php

/*
|--------------------------------------------------------------------------
| Cross-Origin Resource Sharing (CORS) Configuration
|--------------------------------------------------------------------------
|
| The Next.js frontend calls this API from the browser (client components,
| form submissions). Server-side rendering calls it host-to-host and is not
| subject to CORS. Keep the allowed origin list tight and env-driven.
|
*/

$origins = array_values(array_filter(array_map('trim', explode(',', (string) env('FRONTEND_URLS', env('FRONTEND_URL', 'http://localhost:3000'))))));

return [

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    'allowed_origins' => $origins,

    'allowed_origins_patterns' => array_values(array_filter([
        env('FRONTEND_URL_PATTERN'), // e.g. '#^https://.*\.teambees\.com$#'
    ])),

    'allowed_headers' => ['*'],

    'exposed_headers' => ['X-RateLimit-Limit', 'X-RateLimit-Remaining'],

    'max_age' => 3600,

    'supports_credentials' => true,

];
