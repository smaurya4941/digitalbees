<?php

namespace App\Modules\Media\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateMediaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('media.upload') ?? false;
    }

    public function rules(): array
    {
        return [
            'name' => ['sometimes', 'string', 'max:255'],
            'alt_text' => ['sometimes', 'nullable', 'string', 'max:500'],
            'folder' => ['sometimes', 'nullable', 'string', 'max:100'],
        ];
    }
}
