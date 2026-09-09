<?php

namespace App\Modules\Career\Services;

use App\Jobs\NotifyFrontendRevalidate;
use App\Modules\Career\Enums\JobStatus;
use App\Modules\Career\Models\JobApplication;
use App\Modules\Career\Models\JobPosting;
use App\Modules\Career\Repositories\Contracts\CareerRepository;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

final class CareerService
{
    public function __construct(private readonly CareerRepository $careers) {}

    /** @return Collection<int, JobPosting> */
    public function listOpen(): Collection
    {
        return $this->careers->openRoles();
    }

    public function openDetailBySlug(string $slug): ?JobPosting
    {
        return $this->careers->findOpenBySlug($slug);
    }

    // --- Back-office -----------------------------------------------------------

    public function findForAdmin(string $slug): JobPosting
    {
        return $this->careers->findAnyBySlug($slug)
            ?? throw new NotFoundHttpException("Job posting [{$slug}] not found.");
    }

    /** @param  array<string, mixed>  $attributes */
    public function create(array $attributes): JobPosting
    {
        $attributes['status'] ??= JobStatus::Draft->value;
        $this->stampPostedAt($attributes, null);

        $job = $this->careers->create($attributes);
        $this->flush($job);

        return $job;
    }

    /** @param  array<string, mixed>  $attributes */
    public function update(JobPosting $job, array $attributes): JobPosting
    {
        $this->stampPostedAt($attributes, $job);

        $job = $this->careers->update($job, $attributes);
        $this->flush($job);

        return $job;
    }

    public function delete(JobPosting $job): void
    {
        $this->careers->delete($job);
        $this->flush($job);
    }

    public function applications(JobPosting $job, int $perPage = 25): LengthAwarePaginator
    {
        return $this->careers->applicationsFor($job->id, $perPage);
    }

    /** @param  array<string, mixed>  $data */
    public function apply(string $slug, array $data): JobApplication
    {
        $job = $this->careers->findOpenBySlug($slug)
            ?? throw new NotFoundHttpException('This role is no longer accepting applications.');

        if ($job->closes_at !== null && $job->closes_at->isPast()) {
            throw new HttpException(422, 'Applications for this role have closed.');
        }

        return JobApplication::create([
            'job_id' => $job->id,
            'full_name' => $data['full_name'],
            'email' => $data['email'],
            'phone' => $data['phone'] ?? null,
            'cover_note' => $data['cover_note'] ?? null,
            'status' => 'submitted',
        ]);
    }

    /** @param  array<string, mixed>  $attributes */
    private function stampPostedAt(array &$attributes, ?JobPosting $current): void
    {
        $becomingOpen = ($attributes['status'] ?? null) === JobStatus::Open->value
            && $current?->posted_at === null;

        if ($becomingOpen && ! array_key_exists('posted_at', $attributes)) {
            $attributes['posted_at'] = now();
        }
    }

    private function flush(JobPosting $job): void
    {
        NotifyFrontendRevalidate::dispatch(['careers', "career:{$job->slug}"]);
    }
}
