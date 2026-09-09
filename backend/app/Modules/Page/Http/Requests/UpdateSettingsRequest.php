<?php

namespace App\Modules\Page\Http\Requests;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Validator as ValidatorFactory;

class UpdateSettingsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('settings.manage') ?? false;
    }

    public function rules(): array
    {
        return ['values' => ['required', 'array']];
    }

    /**
     * Setting keys contain dots (`contact.email`), which the nested-rule syntax
     * can't express — so each field is validated against its config here and
     * any failures are bucketed under `values`.
     */
    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator): void {
            $fields = config('settings.fields');

            foreach ((array) $this->input('values', []) as $key => $value) {
                if (! isset($fields[$key])) {
                    $validator->errors()->add('values', "Unknown setting [{$key}].");

                    continue;
                }

                $check = ValidatorFactory::make(
                    ['value' => $value],
                    ['value' => $fields[$key]['rules']],
                    [],
                    ['value' => $fields[$key]['label']],
                );

                foreach ($check->errors()->all() as $message) {
                    $validator->errors()->add('values', $message);
                }
            }
        });
    }
}
