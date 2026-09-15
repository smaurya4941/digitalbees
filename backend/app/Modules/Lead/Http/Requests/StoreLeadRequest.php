<?php

namespace App\Modules\Lead\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Validates every public lead-capture submission (blueprint §28: Book a
 * Consultation, Resource Download, Talent Bench Request, and the generic
 * Contact form all post here with a different `form_type`).
 *
 * `company_website` is a honeypot: real visitors never see or fill it (it's
 * hidden off-screen in the form), so `prohibited` rejects any submission
 * that does — the same pattern already used by Newsletter and Career-apply,
 * which this request now matches (it previously wasn't validated here at
 * all, so a filled honeypot silently passed straight through).
 */
class StoreLeadRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /** @return array<string, mixed> */
    public function rules(): array
    {
        return [
            'full_name' => ['required', 'string', 'max:150'],
            'email' => ['required', 'email', 'max:150'],
            'phone' => ['nullable', 'string', 'max:50'],
            'company' => ['nullable', 'string', 'max:150'],
            'message' => ['nullable', 'string', 'max:5000'],
            'form_type' => ['required', 'in:contact,demo_request,newsletter,chatbot'],
            'source_path' => ['nullable', 'string', 'max:500'],
            'practice_slug' => ['nullable', 'string', 'max:150'],
            'region_slug' => ['nullable', 'string', 'max:150'],
            'utm' => ['nullable', 'array'],
            'company_website' => ['prohibited'],
        ];
    }
}
