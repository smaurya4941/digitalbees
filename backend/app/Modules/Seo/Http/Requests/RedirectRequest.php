<?php

namespace App\Modules\Seo\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class RedirectRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('settings.manage') ?? false;
    }

    public function rules(): array
    {
        $id = $this->route('id');
        $creating = $id === null;

        return [
            'from_path' => [
                $creating ? 'required' : 'sometimes',
                'string', 'max:500', 'regex:#^/#',
                Rule::unique('redirects', 'from_path')->ignore($id),
            ],
            'to_path' => [$creating ? 'required' : 'sometimes', 'string', 'max:500'],
            'status_code' => ['sometimes', Rule::in([301, 302, 307, 308])],
            'is_active' => ['sometimes', 'boolean'],
        ];
    }

    public function withValidator($validator): void
    {
        $validator->after(function ($validator): void {
            $from = $this->input('from_path');
            $to = $this->input('to_path');

            if ($from !== null && $from === $to) {
                $validator->errors()->add('to_path', 'A redirect cannot point to itself.');
            }
        });
    }
}
