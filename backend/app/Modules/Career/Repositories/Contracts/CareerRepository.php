<?php

namespace App\Modules\Career\Repositories\Contracts;

use App\Modules\Career\Models\JobPosting;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

interface CareerRepository
{
    /** @return Collection<int, JobPosting> Open roles, newest first, with location. */
    public function openRoles(): Collection;

    public function findOpenBySlug(string $slug): ?JobPosting;

    public function findAnyBySlug(string $slug): ?JobPosting;

    /** @param  array<string, mixed>  $attributes */
    public function create(array $attributes): JobPosting;

    /** @param  array<string, mixed>  $attributes */
    public function update(JobPosting $job, array $attributes): JobPosting;

    public function delete(JobPosting $job): void;

    public function applicationsFor(int $jobId, int $perPage): LengthAwarePaginator;
}
