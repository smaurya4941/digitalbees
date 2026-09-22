<?php

namespace App\Modules\Career\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ParseResumeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /** @return array<string, mixed> */
    public function rules(): array
    {
        return [
            // Same constraints as ApplyToJobRequest so a file that parses also submits.
            'resume' => ['required', 'file', 'mimes:pdf,doc,docx', 'max:5120'],
        ];
    }
}
