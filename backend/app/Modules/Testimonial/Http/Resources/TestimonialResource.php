<?php

namespace App\Modules\Testimonial\Http\Resources;

use App\Modules\Testimonial\Models\Testimonial;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Testimonial
 */
class TestimonialResource extends JsonResource
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
        ];
    }
}
