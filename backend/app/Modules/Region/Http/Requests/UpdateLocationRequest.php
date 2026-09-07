<?php

namespace App\Modules\Region\Http\Requests;

use App\Support\Enums\ContentStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateLocationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // route middleware enforces permission:content.update
    }

    public function rules(): array
    {
        $slug = (string) $this->route('slug');

        return [
            'region_id' => ['sometimes', 'integer', Rule::exists('regions', 'id')],
            'name' => ['sometimes', 'required', 'string', 'max:150'],
            'slug' => [
                'sometimes', 'required', 'string', 'max:255', 'alpha_dash',
                Rule::unique('locations', 'slug')->ignore($slug, 'slug'),
            ],
            'address' => ['nullable', 'string', 'max:2000'],
            'city' => ['nullable', 'string', 'max:100'],
            'country' => ['nullable', 'string', 'max:100'],
            'lat' => ['nullable', 'numeric', 'between:-90,90'],
            'lng' => ['nullable', 'numeric', 'between:-180,180'],
            'status' => ['sometimes', Rule::in([ContentStatus::Draft->value, ContentStatus::Published->value])],
        ];
    }
}
