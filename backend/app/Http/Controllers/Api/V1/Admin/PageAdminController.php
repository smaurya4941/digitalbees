<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Api\V1\Admin\Concerns\GuardsPublishing;
use App\Http\Controllers\Api\V1\ApiController;
use App\Jobs\NotifyFrontendRevalidate;
use App\Modules\Page\Models\Page;
use App\Modules\Page\Models\PageSection;
use App\Support\Enums\ContentStatus;
use App\Support\Http\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class PageAdminController extends ApiController
{
    use GuardsPublishing;

    public function index(): JsonResponse
    {
        $pages = Page::query()
            ->with('template')
            ->orderBy('url_path')
            ->paginate((int) request()->integer('per_page', 50));

        return ApiResponse::page($pages, fn (Page $page) => [
            'id' => $page->id,
            'url_path' => $page->url_path,
            'title' => $page->title,
            'status' => $page->status,
            'template' => $page->template?->key_name,
            'updated_at' => $page->updated_at,
        ]);
    }

    public function show(int $id): JsonResponse
    {
        $page = Page::with(['template', 'sections'])->findOrFail($id);

        return ApiResponse::item([
            'id' => $page->id,
            'url_path' => $page->url_path,
            'title' => $page->title,
            'status' => $page->status,
            'template_key' => $page->template?->key_name,
            'sections' => $page->sections->mapWithKeys(
                fn (PageSection $section) => [$section->section_key => $section->content],
            ),
        ]);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $page = Page::findOrFail($id);

        $validated = $request->validate([
            'title' => ['sometimes', 'string', 'max:255'],
            'status' => ['sometimes', Rule::in(ContentStatus::values())],
            'sections' => ['sometimes', 'array'],
        ]);

        if (array_key_exists('status', $validated)) {
            $this->guardPublish($request, $validated['status'], $page->status);
        }

        DB::transaction(function () use ($validated, $page) {
            $page->fill(array_intersect_key($validated, array_flip(['title', 'status'])));

            if (($validated['status'] ?? null) === ContentStatus::Published->value && $page->published_at === null) {
                $page->published_at = now();
            }

            $page->save();

            foreach ($validated['sections'] ?? [] as $key => $content) {
                PageSection::updateOrCreate(
                    ['page_id' => $page->id, 'section_key' => $key],
                    ['content' => $content],
                );
            }
        });

        NotifyFrontendRevalidate::dispatch(['pages', "page:{$page->url_path}"]);

        return $this->show($id);
    }
}
