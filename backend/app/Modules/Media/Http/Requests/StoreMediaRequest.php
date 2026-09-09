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
                'max:'.(int) config('media.max_size_kb'),
                'mimetypes:'.implode(',', config('media.mimetypes')),
            ],
            'folder' => ['nullable', 'string', 'max:100'],
        ];
    }
}
