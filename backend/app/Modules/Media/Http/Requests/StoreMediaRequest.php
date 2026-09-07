<?php

namespace App\Modules\Media\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreMediaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('media.upload') ?? false;
    }

    public function rules(): array
    {
        return [
            'file' => [
                'required',
                'file',
                'max:10240', // 10MB max
                'mimetypes:image/jpeg,image/png,image/webp,image/svg+xml,application/pdf',
            ],
        ];
    }
}
