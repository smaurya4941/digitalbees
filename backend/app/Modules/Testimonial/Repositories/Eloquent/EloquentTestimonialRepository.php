<?php

namespace App\Modules\Testimonial\Repositories\Eloquent;

use App\Modules\Testimonial\Models\Testimonial;
use App\Modules\Testimonial\Repositories\Contracts\TestimonialRepository;
use Illuminate\Support\Collection;

final class EloquentTestimonialRepository implements TestimonialRepository
{
    public function published(?string $relatedType = null): Collection
    {
        return Testimonial::query()
            ->published()
            ->ordered()
            ->when($relatedType !== null && $relatedType !== '', fn ($q) => $q->for($relatedType))
            ->get();
    }

    public function findById(int $id): ?Testimonial
    {
        return Testimonial::query()->find($id);
    }

    public function create(array $attributes): Testimonial
    {
        return Testimonial::create($attributes);
    }

    public function update(Testimonial $testimonial, array $attributes): Testimonial
    {
        $testimonial->update($attributes);

        return $testimonial;
    }

    public function delete(Testimonial $testimonial): void
    {
        $testimonial->delete();
    }
}
