<?php

namespace App\Modules\Page\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;

/**
 * A single editable site-wide value (schema.sql Module 3). `type` drives how
 * `value` is decoded: string | integer | boolean | json.
 */
class Setting extends Model
{
    protected $guarded = [];

    public function getRouteKeyName(): string
    {
        return 'key_name';
    }

    protected function typedValue(): Attribute
    {
        return Attribute::get(fn (): mixed => match ($this->type) {
            'integer' => (int) $this->value,
            'boolean' => filter_var($this->value, FILTER_VALIDATE_BOOL),
            'json' => json_decode((string) $this->value, true),
            default => $this->value,
        });
    }
}
