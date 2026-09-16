<?php

namespace App\Modules\Faq\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreFaqRequest extends FormRequest
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
            'question' => ['required', 'string', 'max:500'],
            'answer' => ['required', 'string'],
            'faqable_type' => ['nullable', Rule::in(['practice', 'sub_service'])],
            'faqable_id' => ['nullable', 'integer', 'required_with:faqable_type'],
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
