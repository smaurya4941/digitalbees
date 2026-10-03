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
            ['site.tagline', 'Talent and technology, from the same partner.', 'string'],
            // Company facts, as published in TeamBees' profile decks
            // (docs/Docs/TeamBees Profile - *.pdf, "About TeamBees").
            ['company.established', '2021', 'string'],
            ['company.markets', 'India, USA, Singapore, UAE', 'string'],
            ['company.shortlist_turnaround', '2 business days', 'string'],
            ['company.domain_experts', '50+', 'string'],
            ['company.enterprise_customers', '20+', 'string'],
            ['contact.email', 'info@teambeescorp.com', 'string'],
            ['contact.phone', '+1 (800) 886 9600', 'string'],
            ['social.linkedin', 'https://www.linkedin.com/company/teambees-corp/', 'string'],
            ['social.instagram', 'https://www.instagram.com/teambeescorpofficial/', 'string'],
            // No X account yet; the X icon only renders once this is filled in.
            ['social.x', '', 'string'],
            ['seo.default_robots', 'index,follow', 'string'],
            ['seo.title_suffix', ' | TeamBees', 'string'],
            ['feature.chatbot_enabled', '1', 'boolean'],
        ];

        foreach ($settings as [$key, $value, $type]) {
            Setting::updateOrCreate(['key_name' => $key], ['value' => $value, 'type' => $type]);
        }
    }
}
