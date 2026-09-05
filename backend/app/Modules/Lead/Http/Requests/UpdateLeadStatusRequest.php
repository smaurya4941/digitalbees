<?php

namespace App\Modules\Lead\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateLeadStatusRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('content.update') ?? false; // Using content.update as a proxy for CRM update if crm.update is absent
    }

    public function rules(): array
    {
        return [
            'status' => ['required', Rule::in(['new', 'synced', 'failed', 'duplicate'])],
        ];
    }
}
