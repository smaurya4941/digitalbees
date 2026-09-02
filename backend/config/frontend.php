<?php

/*
|--------------------------------------------------------------------------
| Headless frontend integration
|--------------------------------------------------------------------------
|
| Settings for talking to the Next.js app: where to send on-demand cache
| revalidation requests and the shared secret that authenticates them.
|
*/

return [

    'urls' => array_values(array_filter(array_map('trim', explode(',', (string) env('FRONTEND_URLS', env('FRONTEND_URL', 'http://localhost:3000')))))),

    'revalidate' => [
        'url' => env('FRONTEND_REVALIDATE_URL', 'http://localhost:3000/api/revalidate'),
        'secret' => env('FRONTEND_REVALIDATE_SECRET'),
        'timeout' => (int) env('FRONTEND_REVALIDATE_TIMEOUT', 5),
    ],

];
