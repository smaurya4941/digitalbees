<?php

namespace App\Modules\Industry\Http\Requests;

use App\Support\Enums\ContentStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateIndustryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('content.update') ?? false;
    }

    public function rules(): array
    {
        $industryId = $this->route('industry')?->id ?? $this->route('slug');

        return [
            'name' => ['sometimes', 'required', 'string', 'max:100'],
            'slug' => ['sometimes', 'required', 'string', 'max:100', "unique:industries,slug,{$industryId},slug"],
            'summary' => ['nullable', 'string', 'max:1000'],
            'icon' => ['nullable', 'string', 'max:100'],
            'status' => ['nullable', Rule::enum(ContentStatus::class)],
            'sort_order' => ['nullable', 'integer'],
        ];
    }
}
