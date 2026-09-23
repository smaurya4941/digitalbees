<?php

namespace App\Modules\Resource\Http\Requests;

use App\Modules\Resource\Enums\ResourceType;
use App\Support\Enums\ContentStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateResourceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // route middleware enforces permission:content.update
    }

    public function rules(): array
    {
        $slug = (string) $this->route('slug');

        return [
            'title' => ['sometimes', 'required', 'string', 'max:255'],
            'slug' => [
                'sometimes', 'required', 'string', 'max:255', 'alpha_dash',
                Rule::notIn(StoreResourceRequest::RESERVED_SLUGS),
                Rule::unique('resources', 'slug')->ignore($slug, 'slug'),
            ],
            'resource_type' => ['sometimes', Rule::in(ResourceType::values())],
            'status' => ['sometimes', Rule::in(ContentStatus::values())],
            ...StoreResourceRequest::contentRules(),
        ];
    }

    protected function prepareForValidation(): void
    {
        if ($this->has('tags')) {
            $this->merge(StoreResourceRequest::normalizeTags($this->input('tags')));
        }
    }
}
