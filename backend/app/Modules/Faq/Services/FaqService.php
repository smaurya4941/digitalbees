<?php

namespace App\Modules\Faq\Services;

use App\Jobs\NotifyFrontendRevalidate;
use App\Modules\Faq\Models\Faq;
use App\Modules\Faq\Repositories\Contracts\FaqRepository;
use Illuminate\Support\Collection;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

/**
 * Application use-cases for FAQs.
 */
final class FaqService
{
    public function __construct(private readonly FaqRepository $faqs) {}

    /** @return Collection<int, Faq> */
    public function published(?string $faqableType = null, ?int $faqableId = null): Collection
    {
        return $this->faqs->published($faqableType, $faqableId);
    }

    // --- Back-office use-cases ----------------------------------------------

    public function findForAdmin(int $id): Faq
    {
        return $this->faqs->findById($id)
            ?? throw new NotFoundHttpException("Faq [{$id}] not found.");
    }

    /** @param array<string, mixed> $attributes */
    public function create(array $attributes): Faq
    {
        $faq = $this->faqs->create($attributes);
        $this->flush($faq);

        return $faq;
    }

    /** @param array<string, mixed> $attributes */
    public function update(Faq $faq, array $attributes): Faq
    {
        $faq = $this->faqs->update($faq, $attributes);
        $this->flush($faq);

        return $faq;
    }

    public function delete(Faq $faq): void
    {
        $this->faqs->delete($faq);
        $this->flush($faq);
    }

    /** @return list<string> */
    public function statuses(): array
    {
        return ['draft', 'published'];
    }

    private function flush(Faq $faq): void
    {
        $tags = ['faqs'];

        if ($faq->faqable_type !== null && $faq->faqable_id !== null) {
            $tags[] = "{$faq->faqable_type}:{$faq->faqable_id}";

            $parent = $faq->faqable;
            if ($parent !== null && isset($parent->slug)) {
                $tags[] = "{$faq->faqable_type}:{$parent->slug}";
            }
        }

        NotifyFrontendRevalidate::dispatch($tags);
    }
}
