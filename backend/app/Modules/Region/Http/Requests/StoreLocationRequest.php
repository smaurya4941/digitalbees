<?php

namespace App\Modules\Region\Http\Requests;

use App\Support\Enums\ContentStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class StoreLocationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // route middleware enforces permission:content.create
    }

    public function rules(): array
    {
        return [
            'region_id' => ['required', 'integer', Rule::exists('regions', 'id')],
            'name' => ['required', 'string', 'max:150'],
            'slug' => ['nullable', 'string', 'max:255', Rule::unique('locations', 'slug')],
            'address' => ['nullable', 'string', 'max:2000'],
            'city' => ['nullable', 'string', 'max:100'],
            'country' => ['nullable', 'string', 'max:100'],
            'lat' => ['nullable', 'numeric', 'between:-90,90'],
            'lng' => ['nullable', 'numeric', 'between:-180,180'],
            'status' => ['nullable', Rule::in([ContentStatus::Draft->value, ContentStatus::Published->value])],
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'slug' => Str::slug((string) ($this->input('slug') ?: $this->input('city') ?: $this->input('name'))),
        ]);
    }
}
