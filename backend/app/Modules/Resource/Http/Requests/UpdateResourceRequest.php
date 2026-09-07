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
                Rule::unique('resources', 'slug')->ignore($slug, 'slug'),
            ],
            'resource_type' => ['sometimes', Rule::in(ResourceType::values())],
            'excerpt' => ['nullable', 'string', 'max:1000'],
            'body' => ['nullable', 'string'],
            'reading_time_minutes' => ['nullable', 'integer', 'min:0', 'max:600'],
            'status' => ['sometimes', Rule::in(ContentStatus::values())],
        ];
    }
}
