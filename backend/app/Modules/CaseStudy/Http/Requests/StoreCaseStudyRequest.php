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
            'results' => ['nullable', 'string', 'max:2000'],
            'status' => ['nullable', Rule::enum(ContentStatus::class)],
            ...self::structuredRules(),
        ];
    }

    /**
     * Repeater + relation fields shared by create and update. Relation ids
     * become `featured-in` edges (case study → practice/industry/…), the same
     * edges {@see \Database\Seeders\EntityRelationSeeder} writes.
     *
     * @return array<string, mixed>
     */
    public static function structuredRules(): array
    {
        return [
            'metrics' => ['sometimes', 'array', 'max:8'],
            'metrics.*.value' => ['required', 'string', 'max:40'],
            'metrics.*.label' => ['required', 'string', 'max:150'],
            'how_it_works' => ['sometimes', 'array', 'max:8'],
            'how_it_works.*.title' => ['required', 'string', 'max:150'],
            'how_it_works.*.description' => ['nullable', 'string', 'max:1000'],
            'capabilities_used' => ['sometimes', 'array', 'max:12'],
            'capabilities_used.*' => ['string', 'max:100'],
            'practice_ids' => ['sometimes', 'array'],
            'practice_ids.*' => ['integer', 'exists:practices,id'],
            'industry_ids' => ['sometimes', 'array'],
            'industry_ids.*' => ['integer', 'exists:industries,id'],
            'technology_ids' => ['sometimes', 'array'],
            'technology_ids.*' => ['integer', 'exists:technologies,id'],
            'region_ids' => ['sometimes', 'array'],
            'region_ids.*' => ['integer', 'exists:regions,id'],
        ];
    }
}
