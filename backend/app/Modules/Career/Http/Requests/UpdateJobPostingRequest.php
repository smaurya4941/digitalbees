<?php

namespace App\Modules\Career\Http\Requests;

use App\Modules\Career\Enums\JobStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateJobPostingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // route middleware enforces permission:content.update
    }

    public function rules(): array
    {
        $slug = (string) $this->route('slug');

        return [
            'title' => ['sometimes', 'required', 'string', 'max:255'],
            'slug' => [
                'sometimes', 'required', 'string', 'max:255', 'alpha_dash',
                Rule::unique('job_postings', 'slug')->ignore($slug, 'slug'),
            ],
            'location_id' => ['sometimes', 'nullable', 'integer', Rule::exists('locations', 'id')],
            'employment_type' => ['sometimes', Rule::in(['full_time', 'part_time', 'contract'])],
            'description' => ['nullable', 'string'],
            'ats_external_id' => ['nullable', 'string', 'max:100'],
            'status' => ['sometimes', Rule::in(JobStatus::values())],
            'closes_at' => ['nullable', 'date'],
        ];
    }
}
