<?php

namespace App\Modules\Faq\Repositories\Eloquent;

use App\Modules\Faq\Models\Faq;
use App\Modules\Faq\Repositories\Contracts\FaqRepository;
use Illuminate\Support\Collection;

final class EloquentFaqRepository implements FaqRepository
{
    public function published(?string $faqableType = null, ?int $faqableId = null): Collection
    {
        return Faq::query()
            ->published()
            ->ordered()
            ->when(
                $faqableType !== null && $faqableId !== null,
                fn ($q) => $q->for($faqableType, $faqableId),
            )
            ->get();
    }

    public function findById(int $id): ?Faq
    {
        return Faq::query()->find($id);
    }

    public function create(array $attributes): Faq
    {
        return Faq::create($attributes);
    }

    public function update(Faq $faq, array $attributes): Faq
    {
        $faq->update($attributes);

        return $faq;
    }

    public function delete(Faq $faq): void
    {
        $faq->delete();
    }
}
