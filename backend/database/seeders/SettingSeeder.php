<?php

namespace Database\Seeders;

use App\Modules\Page\Models\Setting;
use Illuminate\Database\Seeder;

/**
 * Site-wide editable values (schema.sql Module 3). Static facts the app needs
 * to boot; editorial content stays in its own tables.
 */
class SettingSeeder extends Seeder
{
    public function run(): void
    {
        $settings = [
            ['site.name', 'TeamBees', 'string'],
            ['site.legal_name', 'TeamBees Corp', 'string'],
            ['site.tagline', 'Talent + Technology from the same partner.', 'string'],
            ['contact.email', 'contact@teambees.corp', 'string'],
            ['contact.phone', '+1 (800) 886 9600', 'string'],
            ['social.linkedin', 'https://www.linkedin.com/company/teambees', 'string'],
            ['social.x', 'https://x.com/teambees', 'string'],
            ['seo.default_robots', 'index,follow', 'string'],
            ['seo.title_suffix', ' | TeamBees', 'string'],
            ['feature.chatbot_enabled', '1', 'boolean'],
        ];

        foreach ($settings as [$key, $value, $type]) {
            Setting::updateOrCreate(['key_name' => $key], ['value' => $value, 'type' => $type]);
        }
    }
}
