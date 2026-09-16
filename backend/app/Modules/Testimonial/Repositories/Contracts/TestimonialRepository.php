<?php

namespace App\Modules\Testimonial\Repositories\Contracts;

use App\Modules\Testimonial\Models\Testimonial;
use Illuminate\Support\Collection;

/**
 * Persistence boundary for the Testimonial module. Back-office listing goes
 * straight from the controller through {@see \App\Support\Http\AdminListQuery}
 * (the same pattern as Practice/CaseStudy's admin `index()`), so this
 * contract only covers what a repository actually needs to own: single-row
 * lookups and writes.
 */
interface TestimonialRepository
{
    /** @return Collection<int, Testimonial> Published testimonials, optionally scoped by `related_type`. */
    public function published(?string $relatedType = null): Collection;

    public function findById(int $id): ?Testimonial;

    /** @param array<string, mixed> $attributes */
    public function create(array $attributes): Testimonial;

    /** @param array<string, mixed> $attributes */
    public function update(Testimonial $testimonial, array $attributes): Testimonial;

    public function delete(Testimonial $testimonial): void;
}
