<?php

namespace App\Http\Controllers\Api\V1;

use App\Support\Http\ApiResponse;
use Illuminate\Http\JsonResponse;

/**
 * Backed by the Seo module (app/Modules/Seo).
 * Flat list of indexable public URLs + lastmod + changefreq/priority hints.
 * Consumed by frontend/app/sitemap.ts to emit sitemap.xml.
 */
class SitemapController extends ApiController
{
    public function index(): JsonResponse
    {
        return ApiResponse::notImplemented('SitemapService::entries() across published practices/industries/regions/technologies/case-studies/resources/insights/careers/locations + resolved combo pages; GET /api/v1/sitemap');
    }
}
