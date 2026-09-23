<?php

namespace App\Modules\Resource\Http\Requests;

use App\Modules\Resource\Enums\ResourceType;
use App\Support\Enums\ContentStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class StoreResourceRequest extends FormRequest
{
    /** Slugs that collide with fixed routes (/blog/category/*, /admin/blog/categories, /admin/blog/new). */
    public const RESERVED_SLUGS = ['category', 'categories', 'new'];

    public function authorize(): bool
    {
        return true; // route middleware enforces permission:content.create
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', 'alpha_dash', Rule::notIn(self::RESERVED_SLUGS), Rule::unique('resources', 'slug')],
            'resource_type' => ['required', Rule::in(ResourceType::values())],
            'status' => ['nullable', Rule::in(ContentStatus::values())],
            ...self::contentRules(),
        ];
    }

    /**
     * Rules shared by create and update for every editable content field.
     *
     * @return array<string, list<mixed>>
     */
    public static function contentRules(): array
    {
        return [
            'excerpt' => ['nullable', 'string', 'max:1000'],
            'body' => ['nullable', 'string', 'max:200000'],
            'blog_category_id' => ['nullable', 'integer', Rule::exists('blog_categories', 'id')],
            'cover_image' => ['nullable', 'string', 'max:500', 'url:http,https'],
            'cover_image_alt' => ['nullable', 'string', 'max:255'],
            'author_name' => ['nullable', 'string', 'max:150'],
            'author_role' => ['nullable', 'string', 'max:150'],
            'author_avatar' => ['nullable', 'string', 'max:500', 'url:http,https'],
            'tags' => ['nullable', 'array', 'max:15'],
            'tags.*' => ['string', 'max:40', 'distinct:ignore_case'],
            'is_featured' => ['sometimes', 'boolean'],
            'reading_time_minutes' => ['nullable', 'integer', 'min:0', 'max:600'],
            'published_at' => ['nullable', 'date'],
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'slug' => Str::slug((string) ($this->input('slug') ?: $this->input('title'))),
            ...self::normalizeTags($this->input('tags')),
        ]);
    }

    /**
     * Trim, drop empties and de-duplicate tags before validation.
     *
     * @return array{tags?: list<string>}
     */
    public static function normalizeTags(mixed $tags): array
    {
        if (! is_array($tags)) {
            return [];
        }

        $clean = [];
        foreach ($tags as $tag) {
            $tag = is_string($tag) ? trim(preg_replace('/\s+/u', ' ', $tag) ?? '') : '';
            if ($tag !== '' && ! in_array(mb_strtolower($tag), array_map('mb_strtolower', $clean), true)) {
                $clean[] = $tag;
            }
        }

        return ['tags' => $clean];
    }
}
