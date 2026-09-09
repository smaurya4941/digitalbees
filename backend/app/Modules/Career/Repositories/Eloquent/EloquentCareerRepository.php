<?php

namespace App\Modules\Career\Repositories\Eloquent;

use App\Modules\Career\Models\JobApplication;
use App\Modules\Career\Models\JobPosting;
use App\Modules\Career\Repositories\Contracts\CareerRepository;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

final class EloquentCareerRepository implements CareerRepository
{
    public function openRoles(): Collection
    {
        return JobPosting::query()
            ->open()
            ->with('location:id,name,city,country')
            ->orderByDesc('posted_at')
            ->orderByDesc('id')
            ->get();
    }

    public function findOpenBySlug(string $slug): ?JobPosting
    {
        return JobPosting::query()->open()->with(['location', 'seo'])->where('slug', $slug)->first();
    }

    public function findAnyBySlug(string $slug): ?JobPosting
    {
        return JobPosting::query()->where('slug', $slug)->first();
    }

    public function create(array $attributes): JobPosting
    {
        return JobPosting::create($attributes);
    }

    public function update(JobPosting $job, array $attributes): JobPosting
    {
        $job->update($attributes);

        return $job->refresh();
    }

    public function delete(JobPosting $job): void
    {
        $job->delete();
    }

    public function applicationsFor(int $jobId, int $perPage): LengthAwarePaginator
    {
        return JobApplication::query()
            ->where('job_id', $jobId)
            ->latest('id')
            ->paginate($perPage);
    }
}
