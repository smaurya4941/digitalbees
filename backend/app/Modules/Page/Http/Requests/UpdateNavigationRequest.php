<?php

namespace App\Modules\Page\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateNavigationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('navigation.update') ?? false;
    }

    public function rules(): array
    {
        return [
            'items' => ['present', 'array'],
            'items.*.id' => ['nullable', 'integer'],
            'items.*.label' => ['required', 'string', 'max:150'],
            'items.*.url' => ['nullable', 'string', 'max:255'],
            'items.*.is_active' => ['boolean'],
            'items.*.children' => ['array'],
            'items.*.children.*.id' => ['nullable', 'integer'],
            'items.*.children.*.label' => ['required', 'string', 'max:150'],
            'items.*.children.*.url' => ['nullable', 'string', 'max:255'],
            'items.*.children.*.is_active' => ['boolean'],
        ];
    }
}
