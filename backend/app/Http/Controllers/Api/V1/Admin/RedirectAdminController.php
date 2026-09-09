<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Api\V1\ApiController;
use App\Modules\Seo\Http\Requests\RedirectRequest;
use App\Modules\Seo\Models\Redirect;
use App\Modules\Seo\Services\RedirectService;
use App\Support\Http\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

/**
 * URL redirect management. Gated by `permission:settings.manage`.
 */
class RedirectAdminController extends ApiController
{
    public function __construct(private readonly RedirectService $redirects) {}

    public function index(Request $request): JsonResponse
    {
        return ApiResponse::page(
            $this->redirects->paginate($request->only('q'), (int) $request->integer('per_page', 30)),
            fn (Redirect $r) => [
                'id' => $r->id,
                'from_path' => $r->from_path,
                'to_path' => $r->to_path,
                'status_code' => $r->status_code,
                'is_active' => $r->is_active,
                'updated_at' => $r->updated_at,
            ],
        );
    }

    public function store(RedirectRequest $request): JsonResponse
    {
        $redirect = $this->redirects->create($request->validated());

        return ApiResponse::item($redirect, ['created' => true])->setStatusCode(201);
    }

    public function update(RedirectRequest $request, int $id): JsonResponse
    {
        $redirect = Redirect::query()->find($id)
            ?? throw new NotFoundHttpException("Redirect [{$id}] not found.");

        return ApiResponse::item($this->redirects->update($redirect, $request->validated()));
    }

    public function destroy(int $id): JsonResponse
    {
        $redirect = Redirect::query()->find($id)
            ?? throw new NotFoundHttpException("Redirect [{$id}] not found.");

        $this->redirects->delete($redirect);

        return ApiResponse::item(['deleted' => true, 'id' => $id]);
    }
}
