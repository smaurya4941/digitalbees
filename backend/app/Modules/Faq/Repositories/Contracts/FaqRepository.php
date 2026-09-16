<?php

namespace App\Modules\Faq\Repositories\Contracts;

use App\Modules\Faq\Models\Faq;
use Illuminate\Support\Collection;

/**
 * Persistence boundary for the Faq module. Back-office listing goes through
 * {@see \App\Support\Http\AdminListQuery} directly from the controller (the
 * same pattern as Testimonial's admin `index()`), so this contract only
 * covers single-row lookups and writes.
 */
interface FaqRepository
{
    /** @return Collection<int, Faq> Published FAQs, optionally scoped to one entity. */
    public function published(?string $faqableType = null, ?int $faqableId = null): Collection;

    public function findById(int $id): ?Faq;

    /** @param array<string, mixed> $attributes */
    public function create(array $attributes): Faq;

    /** @param array<string, mixed> $attributes */
    public function update(Faq $faq, array $attributes): Faq;

    public function delete(Faq $faq): void;
}
