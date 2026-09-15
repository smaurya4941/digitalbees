<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'postmark' => [
        'key' => env('POSTMARK_API_KEY'),
    ],

    'resend' => [
        'key' => env('RESEND_API_KEY'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | CRM
    |--------------------------------------------------------------------------
    | `driver` selects the App\Integrations\Crm\Contracts\CrmClient binding
    | (see CrmServiceProvider): `log` is the no-op default that only logs a
    | sync attempt, `hubspot` is the real HubSpot Contacts API client. Never
    | defaults to a live driver — a misconfigured deploy degrades to logging,
    | not silent data loss to a third party.
    */
    'crm' => [
        'driver' => env('CRM_DRIVER', 'log'),
        'api_base_url' => env('CRM_API_BASE_URL', 'https://api.hubapi.com'),
        'api_key' => env('CRM_API_KEY'),
    ],

];
