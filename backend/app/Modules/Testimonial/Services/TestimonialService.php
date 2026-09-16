<?php

namespace App\Modules\Testimonial\Services;

use App\Jobs\NotifyFrontendRevalidate;
use App\Modules\Testimonial\Models\Testimonial;
use App\Modules\Testimonial\Repositories\Contracts\TestimonialRepository;
use Illuminate\Support\Collection;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

/**
 * Application use-cases for testimonials.
 */
final class TestimonialService
{
    public function __construct(private readonly TestimonialRepository $testimonials) {}

    /** @return Collection<int, Testimonial> */
    public function published(?string $relatedType = null): Collection
    {
        return $this->testimonials->published($relatedType);
    }

    // --- Back-office use-cases ----------------------------------------------

    public function findForAdmin(int $id): Testimonial
    {
        return $this->testimonials->findById($id)
            ?? throw new NotFoundHttpException("Testimonial [{$id}] not found.");
    }

    /** @param array<string, mixed> $attributes */
    public function create(array $attributes): Testimonial
    {
        $testimonial = $this->testimonials->create($attributes);
        $this->flush();

        return $testimonial;
    }

    /** @param array<string, mixed> $attributes */
    public function update(Testimonial $testimonial, array $attributes): Testimonial
    {
        $testimonial = $this->testimonials->update($testimonial, $attributes);
        $this->flush();

        return $testimonial;
    }

    public function delete(Testimonial $testimonial): void
    {
        $this->testimonials->delete($testimonial);
        $this->flush();
    }

    /** @return list<string> */
    public function statuses(): array
    {
        return ['draft', 'published'];
    }

    private function flush(): void
    {
        NotifyFrontendRevalidate::dispatch(['testimonials']);
    }
}
