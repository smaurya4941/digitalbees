<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Api\V1\ApiController;
use App\Modules\Media\Http\Requests\StoreMediaRequest;
use App\Modules\Media\Http\Resources\MediaAdminResource;
use App\Modules\Media\Services\MediaService;
use App\Support\Http\ApiResponse;
use Illuminate\Http\JsonResponse;

class MediaAdminController extends ApiController
{
    public function __construct(private readonly MediaService $media) {}

    public function index(): JsonResponse
    {
        return ApiResponse::page(
            $this->media->listForAdmin(),
            fn ($media) => (new MediaAdminResource($media))->resolve(),
        );
    }

    public function store(StoreMediaRequest $request): JsonResponse
    {
        $media = $this->media->upload($request->file('file'));

        return ApiResponse::item(new MediaAdminResource($media), ['created' => true])
            ->setStatusCode(201);
    }

    public function destroy(int $id): JsonResponse
    {
        // Access is gated by `permission:media.delete` on the route.
        $this->media->delete($this->media->findForAdmin($id));

        return ApiResponse::item(['deleted' => true, 'id' => $id]);
    }
}
