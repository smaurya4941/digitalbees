<?php

namespace App\Modules\Faq\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateFaqRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /** @return array<string, mixed> */
    public function rules(): array
    {
        return [
            'question' => ['sometimes', 'required', 'string', 'max:500'],
            'answer' => ['sometimes', 'required', 'string'],
            'faqable_type' => ['nullable', Rule::in(['practice', 'sub_service'])],
            'faqable_id' => ['nullable', 'integer', 'required_with:faqable_type'],
            // Changing publication state needs `content.publish`, checked in the controller.
            'status' => ['sometimes', Rule::in(['draft', 'published'])],
            'sort_order' => ['sometimes', 'integer', 'min:0'],
        ];
    }
}
