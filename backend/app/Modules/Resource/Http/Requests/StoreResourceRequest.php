<?php

namespace App\Modules\Resource\Http\Requests;

use App\Modules\Resource\Enums\ResourceType;
use App\Support\Enums\ContentStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class StoreResourceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // route middleware enforces permission:content.create
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', Rule::unique('resources', 'slug')],
            'resource_type' => ['required', Rule::in(ResourceType::values())],
            'excerpt' => ['nullable', 'string', 'max:1000'],
            'body' => ['nullable', 'string'],
            'reading_time_minutes' => ['nullable', 'integer', 'min:0', 'max:600'],
            'status' => ['nullable', Rule::in(ContentStatus::values())],
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'slug' => Str::slug((string) ($this->input('slug') ?: $this->input('title'))),
        ]);
    }
}
