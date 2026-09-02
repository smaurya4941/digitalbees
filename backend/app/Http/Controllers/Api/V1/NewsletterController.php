<?php

namespace App\Http\Controllers\Api\V1;

use App\Support\Http\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Backed by the Lead module (app/Modules/Lead): newsletter_subscribers.
 */
class NewsletterController extends ApiController
{
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'email' => ['required', 'email', 'max:150'],
            'source_path' => ['nullable', 'string', 'max:500'],
            'company_website' => ['prohibited'], // honeypot
        ]);

        return ApiResponse::accepted(['status' => 'stub']);
    }
}
