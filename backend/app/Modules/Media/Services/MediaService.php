<?php

namespace App\Modules\Media\Services;

use App\Modules\Media\Models\Media;
use App\Modules\Media\Repositories\Contracts\MediaRepository;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

final class MediaService
{
    public function __construct(private readonly MediaRepository $mediaRepository) {}

    public function listForAdmin(int $perPage = 50): LengthAwarePaginator
    {
        return $this->mediaRepository->allForAdmin($perPage);
    }

    public function findForAdmin(int $id): Media
    {
        return $this->mediaRepository->findById($id)
            ?? throw new \Symfony\Component\HttpKernel\Exception\NotFoundHttpException("Media [{$id}] not found.");
    }

    public function upload(UploadedFile $file, string $disk = 'public'): Media
    {
        $originalName = $file->getClientOriginalName();
        $extension = $file->getClientOriginalExtension();
        $mimeType = $file->getMimeType() ?? 'application/octet-stream';
        $size = $file->getSize() ?? 0;

        $fileName = Str::uuid()->toString() . '.' . $extension;
        $path = 'media/' . $fileName;

        Storage::disk($disk)->put($path, $file->getContent());

        return $this->mediaRepository->create([
            'name' => $originalName,
            'file_name' => $fileName,
            'mime_type' => $mimeType,
            'size' => $size,
            'disk' => $disk,
            'path' => $path,
        ]);
    }

    public function delete(Media $media): void
    {
        Storage::disk($media->disk)->delete($media->path);
        $this->mediaRepository->delete($media);
    }
}
