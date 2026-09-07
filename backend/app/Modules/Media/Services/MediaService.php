<?php

namespace App\Modules\Media\Services;

use App\Modules\Media\Models\Media;
use App\Modules\Media\Repositories\Contracts\MediaRepository;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

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
            ?? throw new NotFoundHttpException("Media [{$id}] not found.");
    }

    public function upload(UploadedFile $file): Media
    {
        $disk = config('media.disk');
        $extension = strtolower($file->getClientOriginalExtension() ?: $file->guessExtension() ?: 'bin');
        $fileName = Str::uuid()->toString().'.'.$extension;
        $path = 'media/'.$fileName;

        [$width, $height] = $this->dimensions($file);

        Storage::disk($disk)->put($path, $file->getContent(), 'public');

        return $this->mediaRepository->create([
            'name' => $file->getClientOriginalName(),
            'file_name' => $fileName,
            'mime_type' => $file->getMimeType() ?? 'application/octet-stream',
            'size' => $file->getSize() ?? 0,
            'width' => $width,
            'height' => $height,
            'disk' => $disk,
            'path' => $path,
            'uploaded_by' => Auth::id(),
        ]);
    }

    /** @param  array<string, mixed>  $attributes */
    public function update(Media $media, array $attributes): Media
    {
        return $this->mediaRepository->update($media, $attributes);
    }

    public function delete(Media $media): void
    {
        Storage::disk($media->disk)->delete($media->path);
        $this->mediaRepository->delete($media);
    }

    /** @return array{0: int|null, 1: int|null} */
    private function dimensions(UploadedFile $file): array
    {
        if (! str_starts_with((string) $file->getMimeType(), 'image/')) {
            return [null, null];
        }

        $info = @getimagesize($file->getRealPath());

        return $info === false ? [null, null] : [$info[0] ?? null, $info[1] ?? null];
    }
}
