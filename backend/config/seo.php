<?php

/*
|--------------------------------------------------------------------------
| SEO defaults
|--------------------------------------------------------------------------
|
| Fallbacks used by App\Support\Seo\SeoPayload when a content entity has no
| editor-authored seo_metadata row. Editors can still override per entity.
|
*/

return [
    'default_robots' => env('SEO_DEFAULT_ROBOTS', 'index,follow'),
    'title_suffix' => env('SEO_TITLE_SUFFIX', ' | TeamBees'),
    'organization_name' => env('SEO_ORG_NAME', 'TeamBees'),
];
