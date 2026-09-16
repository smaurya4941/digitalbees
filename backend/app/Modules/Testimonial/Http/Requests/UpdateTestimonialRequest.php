<?php

namespace App\Modules\Testimonial\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateTestimonialRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /** @return array<string, mixed> */
    public function rules(): array
    {
        return [
            'quote' => ['sometimes', 'required', 'string', 'max:2000'],
            'author_name' => ['nullable', 'string', 'max:150'],
            'author_title' => ['nullable', 'string', 'max:150'],
            'author_company' => ['nullable', 'string', 'max:150'],
            'author_photo_media_id' => ['nullable', 'integer'],
            'related_type' => ['nullable', 'string', 'max:100'],
            'related_id' => ['nullable', 'integer'],
            // Changing publication state needs `content.publish`, checked in the controller.
            'status' => ['sometimes', Rule::in(['draft', 'published'])],
            'sort_order' => ['sometimes', 'integer', 'min:0'],
        ];
    }
}
