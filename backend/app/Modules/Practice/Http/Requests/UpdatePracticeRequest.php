<?php

namespace App\Modules\Practice\Http\Requests;

use App\Support\Enums\ContentStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdatePracticeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /** @return array<string, mixed> */
    public function rules(): array
    {
        $currentSlug = (string) $this->route('slug');

        return [
            'name' => ['sometimes', 'required', 'string', 'max:100'],
            'slug' => [
                'sometimes', 'required', 'string', 'max:100', 'alpha_dash',
                Rule::unique('practices', 'slug')->ignore($currentSlug, 'slug'),
            ],
            'tagline' => ['nullable', 'string', 'max:255'],
            'summary' => ['nullable', 'string', 'max:2000'],
            'icon' => ['nullable', 'string', 'max:100'],
            'color_token' => ['nullable', 'string', 'max:50'],
            'featured_image' => ['nullable', 'string', 'max:255', 'url'],
            'sort_order' => ['sometimes', 'integer', 'min:0'],
            // Changing publication state needs `content.publish`, checked in the controller.
            'status' => ['sometimes', Rule::in(ContentStatus::values())],
            'key_stats' => ['sometimes', 'array'],
            'capabilities' => ['sometimes', 'array'],
            'capabilities.*.id' => ['nullable', 'integer'],
            'capabilities.*.title' => ['required_with:capabilities', 'string', 'max:150'],
            'capabilities.*.description' => ['nullable', 'string'],
            'capabilities.*.sort_order' => ['nullable', 'integer', 'min:0'],
            'workflows' => ['sometimes', 'array'],
            'workflows.*.id' => ['nullable', 'integer'],
            'workflows.*.step' => ['nullable', 'integer', 'min:1'],
            'workflows.*.title' => ['required_with:workflows', 'string', 'max:150'],
            'workflows.*.description' => ['nullable', 'string'],
            'workflows.*.sort_order' => ['nullable', 'integer', 'min:0'],
            'framework_stack' => ['sometimes', 'array'],
            'agent_capabilities' => ['sometimes', 'array'],
            'technical_capabilities' => ['sometimes', 'array'],
            'servicenow_fit' => ['sometimes', 'array'],
            'sub_services' => ['sometimes', 'array'],
            'sub_services.*.id' => ['nullable', 'integer'],
            'sub_services.*.name' => ['required', 'string', 'max:150'],
            'sub_services.*.slug' => ['nullable', 'string', 'max:150', 'alpha_dash'],
            'sub_services.*.summary' => ['nullable', 'string'],
            'sub_services.*.body' => ['nullable', 'string'],
            'sub_services.*.whats_included' => ['nullable', 'array'],
            'sub_services.*.whats_included.*.title' => ['required_with:sub_services.*.whats_included', 'string', 'max:150'],
            'sub_services.*.whats_included.*.description' => ['nullable', 'string'],
            'sub_services.*.status' => ['nullable', Rule::in(ContentStatus::values())],
            'sub_services.*.sort_order' => ['nullable', 'integer', 'min:0'],
        ];
    }
}
