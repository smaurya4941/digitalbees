<?php

namespace App\Modules\Resource\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

/** Create + update for blog categories; the slug is derived from the name when blank. */
class BlogCategoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // route middleware enforces the content.* permission
    }

    public function rules(): array
    {
        $id = $this->route('id');
        $required = $this->isMethod('post') ? 'required' : 'sometimes';

        return [
            'name' => [$required, 'string', 'max:100'],
            'slug' => [
                $required, 'string', 'max:120', 'alpha_dash',
                Rule::unique('blog_categories', 'slug')->ignore($id),
            ],
            'description' => ['nullable', 'string', 'max:500'],
            'sort_order' => ['sometimes', 'integer', 'min:0', 'max:10000'],
        ];
    }

    protected function prepareForValidation(): void
    {
        // On create a blank slug comes from the name; on update the slug only
        // changes when the editor sends one (renaming keeps the URL stable).
        $source = $this->isMethod('post')
            ? ($this->input('slug') ?: $this->input('name'))
            : $this->input('slug');

        if (filled($source)) {
            $this->merge(['slug' => Str::slug((string) $source)]);
        }
    }
}
