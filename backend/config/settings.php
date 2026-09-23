<?php

/*
|--------------------------------------------------------------------------
| Editable site-wide settings
|--------------------------------------------------------------------------
|
| The single source of truth for the settings admin screen. Each field is
| rendered from this config and validated against its `rules`. Values live in
| the `settings` table (key_name / value / type); anything not listed here is
| ignored by the admin API.
|
| `public` fields are also exposed unauthenticated at GET /api/v1/settings for
| the frontend layout.
|
*/

return [

    'groups' => [
        'site' => 'Site',
        'contact' => 'Contact',
        'social' => 'Social',
        'seo' => 'SEO',
        'features' => 'Features',
        'blog' => 'Blog',
    ],

    'fields' => [
        'site.name' => [
            'type' => 'string', 'label' => 'Site name', 'group' => 'site', 'public' => true,
            'rules' => ['required', 'string', 'max:120'],
        ],
        'site.legal_name' => [
            'type' => 'string', 'label' => 'Legal entity name', 'group' => 'site', 'public' => true,
            'rules' => ['nullable', 'string', 'max:150'],
        ],
        'site.tagline' => [
            'type' => 'string', 'label' => 'Tagline', 'group' => 'site', 'public' => true,
            'rules' => ['nullable', 'string', 'max:200'],
        ],
        'contact.email' => [
            'type' => 'string', 'label' => 'Contact email', 'group' => 'contact', 'public' => true,
            'rules' => ['nullable', 'email', 'max:150'],
        ],
        'contact.phone' => [
            'type' => 'string', 'label' => 'Contact phone', 'group' => 'contact', 'public' => true,
            'rules' => ['nullable', 'string', 'max:40'],
        ],
        'social.linkedin' => [
            'type' => 'string', 'label' => 'LinkedIn URL', 'group' => 'social', 'public' => true,
            'rules' => ['nullable', 'url', 'max:255'],
        ],
        'social.x' => [
            'type' => 'string', 'label' => 'X / Twitter URL', 'group' => 'social', 'public' => true,
            'rules' => ['nullable', 'url', 'max:255'],
        ],
        'seo.default_robots' => [
            'type' => 'string', 'label' => 'Default robots directive', 'group' => 'seo', 'public' => false,
            'rules' => ['required', 'string', 'max:50'],
        ],
        'seo.title_suffix' => [
            'type' => 'string', 'label' => 'Title suffix', 'group' => 'seo', 'public' => false,
            'rules' => ['nullable', 'string', 'max:60'],
        ],
        'feature.chatbot_enabled' => [
            'type' => 'boolean', 'label' => 'Bee Assistant chatbot', 'group' => 'features', 'public' => true,
            'rules' => ['boolean'],
        ],
        'blog.title' => [
            'type' => 'string', 'label' => 'Blog page title', 'group' => 'blog', 'public' => true,
            'default' => 'The TeamBees Blog',
            'rules' => ['nullable', 'string', 'max:120'],
        ],
        'blog.description' => [
            'type' => 'string', 'label' => 'Blog page intro', 'group' => 'blog', 'public' => true,
            'default' => 'Field notes on engineering, AI, talent and delivery from our practice leads.',
            'rules' => ['nullable', 'string', 'max:300'],
        ],
        'blog.posts_per_page' => [
            'type' => 'integer', 'label' => 'Posts per page', 'group' => 'blog', 'public' => true,
            'default' => 9,
            'rules' => ['nullable', 'integer', 'min:3', 'max:48'],
        ],
    ],

    'cache_key' => 'settings.resolved',
];
