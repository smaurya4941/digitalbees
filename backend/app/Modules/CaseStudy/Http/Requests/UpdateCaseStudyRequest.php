<?php

namespace App\Modules\CaseStudy\Http\Requests;

use App\Support\Enums\ContentStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateCaseStudyRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('content.update') ?? false;
    }

    public function rules(): array
    {
        $caseStudyId = $this->route('case_study')?->id ?? $this->route('slug');

        return [
            'title' => ['sometimes', 'required', 'string', 'max:150'],
            'slug' => ['sometimes', 'required', 'string', 'max:150', "unique:case_studies,slug,{$caseStudyId},slug"],
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
