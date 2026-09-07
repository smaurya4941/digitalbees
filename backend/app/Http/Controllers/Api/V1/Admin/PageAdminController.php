<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Api\V1\ApiController;
use App\Modules\Page\Models\Page;
use App\Modules\Page\Models\PageSection;
use App\Support\Http\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PageAdminController extends ApiController
{
    public function index(): JsonResponse
    {
        $pages = Page::query()
            ->with('template')
            ->orderBy('url_path')
            ->paginate(50);

        return ApiResponse::paginated($pages, function (Page $page) {
            return [
                'id' => $page->id,
                'url_path' => $page->url_path,
                'title' => $page->title,
                'status' => $page->status,
                'template' => $page->template?->key_name,
                'updated_at' => $page->updated_at,
            ];
        });
    }

    public function show(int $id): JsonResponse
    {
        $page = Page::with(['template', 'sections'])->findOrFail($id);

        $sections = $page->sections->mapWithKeys(function ($section) {
            return [$section->section_key => $section->content];
        });

        return ApiResponse::item([
            'id' => $page->id,
            'url_path' => $page->url_path,
            'title' => $page->title,
            'status' => $page->status,
            'template_key' => $page->template?->key_name,
            'sections' => $sections,
        ]);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $page = Page::findOrFail($id);

        $request->validate([
            'title' => ['sometimes', 'string', 'max:255'],
            'status' => ['sometimes', 'in:draft,published,archived'],
            'sections' => ['sometimes', 'array'],
        ]);

        DB::transaction(function () use ($request, $page) {
            if ($request->has('title') || $request->has('status')) {
                $page->update($request->only(['title', 'status']));
            }

            if ($request->has('sections')) {
                $sectionsData = $request->input('sections');

                foreach ($sectionsData as $key => $content) {
                    PageSection::updateOrCreate(
                        ['page_id' => $page->id, 'section_key' => $key],
                        ['content' => $content]
                    );
                }
            }
        });

        return $this->show($id);
    }
}
