<?php

namespace App\Http\Controllers\Api\V1;

use App\Support\Http\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Backed by the Page module (app/Modules/Page): navigation_menus + navigation_items.
 * Returns the resolved menu trees (header, footer, mega-menu) the frontend
 * renders in its layout. Cache aggressively; bust on nav edits.
 */
class NavigationController extends ApiController
{
    public function index(Request $request): JsonResponse
    {
        return ApiResponse::notImplemented('NavigationService::tree(keys: header|footer|mega); GET /api/v1/navigation');
    }
}
