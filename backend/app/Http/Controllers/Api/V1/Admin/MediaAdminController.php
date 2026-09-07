<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Api\V1\ApiController;
use App\Modules\Media\Http\Requests\StoreMediaRequest;
use App\Modules\Media\Http\Requests\UpdateMediaRequest;
use App\Modules\Media\Http\Resources\MediaAdminResource;
use App\Modules\Media\Services\MediaService;
use App\Support\Http\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Media library. Access is gated by `permission:media.upload` (read + write)
 * and `permission:media.delete` (destroy) on the routes.
 */
class MediaAdminController extends ApiController
{
    public function __construct(private readonly MediaService $media) {}

    public function index(Request $request): JsonResponse
    {
        $filters = array_filter([
            'q' => $request->string('q')->toString() ?: null,
        ], fn ($v) => $v !== null);

        if ($request->has('folder')) {
            $filters['folder'] = $request->string('folder')->toString();
        }

        return ApiResponse::page(
            $this->media->listForAdmin($filters, 40),
            fn ($media) => (new MediaAdminResource($media->loadMissing('uploader')))->resolve(),
            ['folders' => $this->media->folders()],
        );
    }

    public function show(int $id): JsonResponse
    {
        $media = $this->media->findForAdmin($id)->loadMissing('uploader');

        return ApiResponse::item([
            ...(new MediaAdminResource($media))->resolve(),
            'usages' => $this->media->usages($media),
        ]);
    }

    public function store(StoreMediaRequest $request): JsonResponse
    {
        $media = $this->media->upload($request->file('file'));

        if ($request->filled('folder')) {
            $media = $this->media->update($media, ['folder' => $request->string('folder')->toString()]);
        }

        return ApiResponse::item(new MediaAdminResource($media), ['created' => true])
            ->setStatusCode(201);
    }

    public function update(UpdateMediaRequest $request, int $id): JsonResponse
    {
        $media = $this->media->update($this->media->findForAdmin($id), $request->validated());

        return ApiResponse::item(new MediaAdminResource($media));
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        $this->media->delete($this->media->findForAdmin($id), $request->boolean('force'));

        return ApiResponse::item(['deleted' => true, 'id' => $id]);
    }
}
