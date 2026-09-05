<?php

namespace App\Modules\Region\Http\Requests;

use App\Support\Enums\ContentStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreRegionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('content.create') ?? false;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:100'],
            'slug' => ['required', 'string', 'max:100', 'unique:regions,slug'],
            'summary' => ['nullable', 'string', 'max:1000'],
            'iso_code' => ['nullable', 'string', 'max:10'],
            'status' => ['nullable', Rule::enum(ContentStatus::class)],
            'sort_order' => ['nullable', 'integer'],
        ];
    }
}
