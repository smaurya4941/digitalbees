<?php

namespace App\Modules\Testimonial\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreTestimonialRequest extends FormRequest
{
    public function authorize(): bool
    {
        // HTTP authorization is enforced by the `permission:` route middleware.
        return true;
    }

    /** @return array<string, mixed> */
    public function rules(): array
    {
        return [
            'quote' => ['required', 'string', 'max:2000'],
            'author_name' => ['nullable', 'string', 'max:150'],
            'author_title' => ['nullable', 'string', 'max:150'],
            'author_company' => ['nullable', 'string', 'max:150'],
            'author_photo_media_id' => ['nullable', 'integer'],
            // A loose tag, not a strict enum: either a morph-map key
            // (`practice`, `case_study`, ...) or a literal like `home` that
            // isn't backed by a model — see Testimonial::scopeFor().
            'related_type' => ['nullable', 'string', 'max:100'],
            'related_id' => ['nullable', 'integer'],
            'status' => ['nullable', Rule::in(['draft', 'published'])],
            'sort_order' => ['nullable', 'integer', 'min:0'],
        ];
    }

    /** @return array<string, mixed> */
    public function validatedAttributes(): array
    {
        $data = $this->validated();
        $data['status'] ??= 'draft';

        return $data;
    }
}
