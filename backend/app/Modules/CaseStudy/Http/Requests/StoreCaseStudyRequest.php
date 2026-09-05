<?php

namespace App\Modules\CaseStudy\Http\Requests;

use App\Support\Enums\ContentStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreCaseStudyRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('content.create') ?? false;
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:150'],
            'slug' => ['required', 'string', 'max:150', 'unique:case_studies,slug'],
            'client_name' => ['nullable', 'string', 'max:100'],
            'summary' => ['nullable', 'string', 'max:1000'],
            'challenge' => ['nullable', 'string', 'max:2000'],
            'solution' => ['nullable', 'string', 'max:2000'],
            'impact' => ['nullable', 'string', 'max:2000'],
            'hero_image' => ['nullable', 'string', 'max:255'],
            'status' => ['nullable', Rule::enum(ContentStatus::class)],
            'sort_order' => ['nullable', 'integer'],
        ];
    }
}
