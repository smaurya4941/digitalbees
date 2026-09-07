<?php

namespace App\Modules\Seo\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class SeoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('seo.update') ?? false;
    }

    public function rules(): array
    {
        return [
            'meta_title' => ['sometimes', 'nullable', 'string', 'max:70'],
            'meta_description' => ['sometimes', 'nullable', 'string', 'max:200'],
            'canonical_url' => ['sometimes', 'nullable', 'string', 'max:255'],
            'robots' => ['sometimes', 'nullable', 'string', 'max:50'],
            'og_title' => ['sometimes', 'nullable', 'string', 'max:255'],
            'og_description' => ['sometimes', 'nullable', 'string', 'max:300'],
            'og_image_id' => ['sometimes', 'nullable', 'integer', Rule::exists('assets', 'id')],
        ];
    }
}
