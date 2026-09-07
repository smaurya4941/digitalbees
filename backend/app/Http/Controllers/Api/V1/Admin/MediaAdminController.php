<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Api\V1\ApiController;
use App\Modules\Media\Http\Requests\StoreMediaRequest;
use App\Modules\Media\Http\Requests\UpdateMediaRequest;
use App\Modules\Media\Http\Resources\MediaAdminResource;
use App\Modules\Media\Services\MediaService;
use App\Support\Http\ApiResponse;
use Illuminate\Http\JsonResponse;

/**
 * Media library. Access is gated by `permission:media.upload` (read + write)
 * and `permission:media.delete` (destroy) on the routes.
 */
class MediaAdminController extends ApiController
{
    public function __construct(private readonly MediaService $media) {}

    public function index(): JsonResponse
    {
        return ApiResponse::page(
            $this->media->listForAdmin(),
            fn ($media) => (new MediaAdminResource($media->loadMissing('uploader')))->resolve(),
        );
    }

    public function show(int $id): JsonResponse
    {
        return ApiResponse::item(
            new MediaAdminResource($this->media->findForAdmin($id)->loadMissing('uploader')),
        );
    }

    public function store(StoreMediaRequest $request): JsonResponse
    {
        $media = $this->media->upload($request->file('file'));

        return ApiResponse::item(new MediaAdminResource($media), ['created' => true])
            ->setStatusCode(201);
    }

    public function update(UpdateMediaRequest $request, int $id): JsonResponse
    {
        $media = $this->media->update($this->media->findForAdmin($id), $request->validated());

        return ApiResponse::item(new MediaAdminResource($media));
    }

    public function destroy(int $id): JsonResponse
    {
        $this->media->delete($this->media->findForAdmin($id));

        return ApiResponse::item(['deleted' => true, 'id' => $id]);
    }
}
