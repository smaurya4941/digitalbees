<?php

namespace App\Modules\Career\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ApplyToJobRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'full_name' => ['required', 'string', 'max:150'],
            'email' => ['required', 'email', 'max:150'],
            'phone' => ['nullable', 'string', 'max:50'],
            'cover_note' => ['nullable', 'string', 'max:5000'],
            // 5MB, matches the mobile-completion-friendly guidance in blueprint §28.2.
            'resume' => ['nullable', 'file', 'mimes:pdf,doc,docx', 'max:5120'],
            // Honeypot — real submitters never fill this.
            'company_website' => ['prohibited'],
        ];
    }
}
