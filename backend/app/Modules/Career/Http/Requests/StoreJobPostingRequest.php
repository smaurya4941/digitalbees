<?php

namespace App\Modules\Career\Http\Requests;

use App\Modules\Career\Enums\JobStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class StoreJobPostingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // route middleware enforces permission:content.create
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', Rule::unique('job_postings', 'slug')],
            'location_id' => ['nullable', 'integer', Rule::exists('locations', 'id')],
            'employment_type' => ['required', Rule::in(['full_time', 'part_time', 'contract'])],
            'description' => ['nullable', 'string'],
            'ats_external_id' => ['nullable', 'string', 'max:100'],
            'status' => ['nullable', Rule::in(JobStatus::values())],
            'closes_at' => ['nullable', 'date'],
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'slug' => Str::slug((string) ($this->input('slug') ?: $this->input('title'))),
        ]);
    }
}
