<?php

namespace App\Modules\Page\Services;

use App\Jobs\NotifyFrontendRevalidate;
use App\Modules\Page\Models\Setting;
use Illuminate\Support\Facades\Cache;

/**
 * Reads and writes the site-wide settings defined in config/settings.php.
 * Values are cached indefinitely and the cache is busted on every write.
 */
final class SettingService
{
    /** @return array<string, mixed> resolved key => typed value */
    public function resolved(): array
    {
        return Cache::rememberForever(config('settings.cache_key'), function (): array {
            $stored = Setting::query()->pluck('value', 'key_name');
            $out = [];

            foreach (config('settings.fields') as $key => $field) {
                $raw = $stored->get($key);
                $out[$key] = $raw === null ? $this->default($field) : $this->cast($raw, $field['type']);
            }

            return $out;
        });
    }

    /** @return array<string, mixed> only the fields flagged `public` */
    public function publicValues(): array
    {
        $resolved = $this->resolved();

        return collect(config('settings.fields'))
            ->filter(fn ($field) => $field['public'] ?? false)
            ->keys()
            ->mapWithKeys(fn (string $key) => [$key => $resolved[$key] ?? null])
            ->all();
    }

    /**
     * The field catalog + current values, grouped for the admin screen.
     *
     * @return array<string, mixed>
     */
    public function adminView(): array
    {
        $resolved = $this->resolved();
        $groups = [];

        foreach (config('settings.fields') as $key => $field) {
            $groups[$field['group']][] = [
                'key' => $key,
                'label' => $field['label'],
                'type' => $field['type'],
                'value' => $resolved[$key] ?? null,
            ];
        }

        return [
            'groups' => collect(config('settings.groups'))
                ->map(fn (string $label, string $id) => [
                    'id' => $id,
                    'label' => $label,
                    'fields' => $groups[$id] ?? [],
                ])
                ->values()
                ->all(),
        ];
    }

    /** @param  array<string, mixed>  $values */
    public function bulkUpdate(array $values): void
    {
        $fields = config('settings.fields');

        foreach ($values as $key => $value) {
            if (! isset($fields[$key])) {
                continue;
            }

            Setting::updateOrCreate(
                ['key_name' => $key],
                ['value' => $this->serialize($value, $fields[$key]['type']), 'type' => $fields[$key]['type']],
            );
        }

        Cache::forget(config('settings.cache_key'));
        NotifyFrontendRevalidate::dispatch(['settings']);
    }

    private function cast(mixed $raw, string $type): mixed
    {
        return match ($type) {
            'integer' => (int) $raw,
            'boolean' => filter_var($raw, FILTER_VALIDATE_BOOL),
            'json' => json_decode((string) $raw, true),
            default => (string) $raw,
        };
    }

    private function serialize(mixed $value, string $type): string
    {
        return match ($type) {
            'boolean' => $value ? '1' : '0',
            'json' => json_encode($value),
            default => (string) $value,
        };
    }

    private function default(array $field): mixed
    {
        if (array_key_exists('default', $field)) {
            return $field['default'];
        }

        return match ($field['type']) {
            'boolean' => false,
            'integer' => 0,
            default => null,
        };
    }
}
