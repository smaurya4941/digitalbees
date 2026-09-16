<?php

namespace App\Modules\Testimonial\Http\Resources;

use App\Modules\Testimonial\Models\Testimonial;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Full testimonial row for the back-office. Distinct from the public
 * {@see TestimonialResource}, which never leaks drafts or the relation tag.
 *
 * @mixin Testimonial
 */
class TestimonialAdminResource extends JsonResource
{
    /** @return array<string, mixed> */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'quote' => $this->quote,
            'author_name' => $this->author_name,
            'author_title' => $this->author_title,
            'author_company' => $this->author_company,
            'author_photo_media_id' => $this->author_photo_media_id,
            'related_type' => $this->related_type,
            'related_id' => $this->related_id,
            'status' => $this->status,
            'sort_order' => $this->sort_order,
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
