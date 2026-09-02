<?php

namespace App\Http\Controllers\Api\V1;

use App\Support\Http\ApiResponse;
use Illuminate\Http\JsonResponse;

/**
 * Backed by the Seo module (app/Modules/Seo): redirects table.
 * Feeds the Next.js middleware / next.config redirect map. Small payload,
 * long cache, busted whenever a redirect row changes.
 */
class RedirectController extends ApiController
{
    public function index(): JsonResponse
    {
        return ApiResponse::notImplemented('RedirectRepository::allActive() -> [{ from, to, status_code }]; GET /api/v1/redirects');
    }
}
