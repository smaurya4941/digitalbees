<?php

namespace App\Http\Controllers\Api\V1;

use App\Modules\Page\Services\NavigationService;
use App\Support\Http\ApiResponse;
use Illuminate\Http\JsonResponse;

/**
 * Backed by the Page module: navigation_menus + navigation_items.
 * Returns the resolved menu trees (header, footer, mega-menus) the frontend
 * renders in its layout. CMS-managed; cache aggressively, bust on nav edits.
 */
class NavigationController extends ApiController
{
    public function __construct(private readonly NavigationService $navigation) {}

    /** GET /api/v1/navigation */
    public function index(): JsonResponse
    {
        return ApiResponse::item($this->navigation->all());
    }
}
