<?php

namespace App\Modules\Practice\Http\Requests;

use App\Support\Enums\ContentStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class StorePracticeRequest extends FormRequest
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
            'name' => ['required', 'string', 'max:100'],
            'slug' => ['nullable', 'string', 'max:100', 'alpha_dash', Rule::unique('practices', 'slug')],
            'tagline' => ['nullable', 'string', 'max:255'],
            'summary' => ['nullable', 'string', 'max:2000'],
            'icon' => ['nullable', 'string', 'max:100'],
            'color_token' => ['nullable', 'string', 'max:50'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'status' => ['nullable', Rule::in(ContentStatus::values())],
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'slug' => Str::slug((string) ($this->input('slug') ?: $this->input('name'))),
        ]);
    }

    /** @return array<string, mixed> */
    public function validatedAttributes(): array
    {
        $data = $this->validated();
        $data['status'] ??= ContentStatus::Draft->value;

        return $data;
    }
}
