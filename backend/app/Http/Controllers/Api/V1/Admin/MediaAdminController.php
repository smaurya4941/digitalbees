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
        // For simplicity, we just return the paginated list wrapped in our ApiResponse format.
        $paginator = $this->media->listForAdmin();

        return response()->json([
            'data' => MediaAdminResource::collection($paginator->items()),
            'meta' => [
                'current_page' => $paginator->currentPage(),
                'last_page' => $paginator->lastPage(),
                'per_page' => $paginator->perPage(),
                'total' => $paginator->total(),
            ]
        ]);
    }

    public function store(StoreMediaRequest $request): JsonResponse
    {
        $file = $request->file('file');
        
        $media = $this->media->upload($file);

        return ApiResponse::item(new MediaAdminResource($media), ['created' => true])
            ->setStatusCode(201);
    }

    public function destroy(int $id): JsonResponse
    {
        $media = $this->media->findForAdmin($id);
        
        // Ensure user has delete permission
        if (request()->user()?->cannot('content.delete')) {
            abort(403, 'Deleting media requires the content.delete permission.');
        }

        $this->media->delete($media);

        return ApiResponse::item(['deleted' => true, 'id' => $id]);
    }
}
