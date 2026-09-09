<?php

namespace App\Modules\Region\Services;

use App\Jobs\NotifyFrontendRevalidate;
use App\Modules\Region\Models\Location;
use App\Modules\Region\Repositories\Contracts\LocationRepository;
use App\Support\Enums\ContentStatus;
use Illuminate\Support\Collection;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

final class LocationService
{
    public function __construct(private readonly LocationRepository $locations) {}

    /** @return Collection<int, Location> */
    public function listPublished(): Collection
    {
        return $this->locations->allPublished();
    }

    public function detailBySlug(string $slug): ?Location
    {
        return $this->locations->findPublishedBySlug($slug);
    }

    // --- Back-office -----------------------------------------------------------

    public function findForAdmin(string $slug): Location
    {
        return $this->locations->findAnyBySlug($slug)
            ?? throw new NotFoundHttpException("Location [{$slug}] not found.");
    }

    /** @param  array<string, mixed>  $attributes */
    public function create(array $attributes): Location
    {
        $attributes['status'] ??= ContentStatus::Draft->value;

        $location = $this->locations->create($attributes);
        $this->flush($location);

        return $location;
    }

    /** @param  array<string, mixed>  $attributes */
    public function update(Location $location, array $attributes): Location
    {
        $location = $this->locations->update($location, $attributes);
        $this->flush($location);

        return $location;
    }

    public function delete(Location $location): void
    {
        $this->locations->delete($location);
        $this->flush($location);
    }

    private function flush(Location $location): void
    {
        NotifyFrontendRevalidate::dispatch(['locations', "location:{$location->slug}"]);
    }
}
