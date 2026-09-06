<?php

namespace App\Http\Controllers\Api\V1;

use App\Support\Http\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Backed by the Page module (app/Modules/Page): pages + page_templates + page_sections.
 *
 * Resolves an arbitrary public URL path (including combinatorial routes like
 * /industries/{industry}/{practice} or /regions/{region}/{practice}) to a
 * published page: which frontend template key to render, its ordered
 * section blocks, the primary + secondary entities, and the SEO block.
 * Returns 404 when the combination is not published.
 */
class PageController extends ApiController
{
    public function resolve(Request $request): JsonResponse
    {
        $request->validate(['path' => ['required', 'string', 'max:500']]);

        $path = $request->string('path')->toString();

        $page = \App\Modules\Page\Models\Page::with(['template', 'sections'])
            ->where('url_path', $path)
            ->where('status', 'published')
            ->first();

        if (!$page) {
            return ApiResponse::error('Page not found', 404);
        }

        $sections = $page->sections->mapWithKeys(function ($section) {
            return [$section->section_key => $section->content];
        });

        return ApiResponse::item([
            'id' => $page->id,
            'url_path' => $page->url_path,
            'title' => $page->title,
            'template_key' => $page->template?->key_name,
            'sections' => $sections,
        ]);
    }
}
