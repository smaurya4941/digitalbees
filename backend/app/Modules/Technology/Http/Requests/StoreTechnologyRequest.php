<?php

namespace App\Modules\Technology\Http\Requests;

use App\Support\Enums\ContentStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreTechnologyRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('content.create') ?? false;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:100'],
            'slug' => ['required', 'string', 'max:100', 'unique:technologies,slug'],
            'summary' => ['nullable', 'string', 'max:1000'],
            'icon' => ['nullable', 'string', 'max:100'],
            'status' => ['nullable', Rule::enum(ContentStatus::class)],
            'sort_order' => ['nullable', 'integer'],
        ];
    }
}
