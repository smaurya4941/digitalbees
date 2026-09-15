<?php

namespace App\Http\Controllers\Api\V1;

use App\Modules\Page\Http\Resources\PageResolutionResource;
use App\Modules\Page\Models\Page;
use App\Modules\Page\Services\PageResolutionService;
use App\Support\Http\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Backed by the Page module (app/Modules/Page): pages + page_templates + page_sections.
 *
 * Resolves an arbitrary public URL path (including combinatorial routes like
 * /industries/{industry}/{practice} or /regions/{region}/{practice}, and
 * simple CMS pages like /company/newsroom) to a published page: which
 * frontend template key to render, the primary + secondary entities, its
 * ordered section blocks, related case studies, and the SEO block. Throws a
 * real 404 (never a 200 with empty data) when the path isn't published —
 * this is what makes non-curated combinatorial URLs 404 correctly rather
 * than rendering a thin doorway page (IA doc §5, §7).
 */
class PageController extends ApiController
{
    public function __construct(private readonly PageResolutionService $pages) {}

    public function resolve(Request $request): JsonResponse
    {
        $request->validate(['path' => ['required', 'string', 'max:500']]);

        $path = $request->string('path')->toString();

        return ApiResponse::item(new PageResolutionResource($this->pages->resolve($path)));
    }

    /**
     * GET /api/v1/pages — lightweight public listing of published pages, used
     * by the frontend sitemap to enumerate curated combinatorial URLs without
     * ever generating one speculatively.
     */
    public function index(Request $request): JsonResponse
    {
        $templateKey = $request->string('template_key')->toString();

        $pages = Page::query()
            ->with('template')
            ->published()
            ->when($templateKey !== '', fn ($q) => $q->whereHas(
                'template',
                fn ($t) => $t->where('key_name', $templateKey),
            ))
            ->orderBy('url_path')
            ->get(['id', 'url_path', 'page_template_id', 'updated_at']);

        return ApiResponse::collection($pages->map(fn (Page $page) => [
            'id' => $page->id,
            'url_path' => $page->url_path,
            'template_key' => $page->template?->key_name,
            'updated_at' => $page->updated_at?->toIso8601String(),
        ]));
    }
}
