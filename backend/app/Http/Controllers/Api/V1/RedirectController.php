<?php

namespace App\Http\Controllers\Api\V1;

use App\Modules\Seo\Services\RedirectService;
use App\Support\Http\ApiResponse;
use Illuminate\Http\JsonResponse;

/**
 * Backed by the Seo module: the `redirects` table.
 * Feeds the Next.js proxy redirect map. Small payload, long cache, busted
 * whenever a redirect row changes.
 */
class RedirectController extends ApiController
{
    public function __construct(private readonly RedirectService $redirects) {}

    public function index(): JsonResponse
    {
        return ApiResponse::collection($this->redirects->allActive());
    }
}
