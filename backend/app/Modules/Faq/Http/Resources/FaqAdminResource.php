<?php

namespace App\Modules\Faq\Http\Resources;

use App\Modules\Faq\Models\Faq;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Full FAQ row for the back-office. Distinct from the public
 * {@see FaqResource}, which never leaks drafts or the relation.
 *
 * @mixin Faq
 */
class FaqAdminResource extends JsonResource
{
    /** @return array<string, mixed> */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'question' => $this->question,
            'answer' => $this->answer,
            'faqable_type' => $this->faqable_type,
            'faqable_id' => $this->faqable_id,
            'status' => $this->status,
            'sort_order' => $this->sort_order,
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
