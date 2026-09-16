<?php

namespace Database\Seeders;

use App\Modules\Company\Models\CompanyMilestone;
use App\Modules\Company\Models\Partner;
use App\Modules\Page\Models\Page;
use App\Modules\Page\Models\PageTemplate;
use Illuminate\Database\Seeder;

/**
 * The five Company sub-pages (blueprint §26.1), replacing the retired
 * `AboutPageSeeder` and its single `/about-us` page (which also carried two
 * fabricated named testimonials — not carried forward here; see
 * TestimonialSeeder's anonymized-attribution convention instead).
 *
 * Milestones now reflect the real journey published in TeamBees' own sales
 * decks (Staff Augmentation / ServiceNow / AI Capabilities profiles, §3
 * "TeamBees Journey & Global Presence") — company-provided source material,
 * not fabricated.
 *
 * Partners are seeded from the same decks' "Client Portfolio" slides as
 * `status => draft`: the names are real (as published by TeamBees itself),
 * but no logo image assets exist in this repo and named-client display
 * requires marketing/legal sign-off per the blueprint's own rule (§10.3,
 * §25.3) — so these stay unpublished until an editor uploads an approved
 * logo and flips status via the admin CMS. `team_members` (Leadership) is
 * still deliberately left unseeded: there is no source material naming real
 * executives, and inventing them would be fabrication in a way the client
 * list and milestones (both sourced directly from TeamBees' own published
 * decks) are not. Idempotent.
 */
class CompanySeeder extends Seeder
{
    public function run(): void
    {
        $this->seedMilestones();
        $this->seedPartners();
        $this->seedNewsroom();
        $this->seedEsg();
    }

    private function seedMilestones(): void
    {
        $milestones = [
            [
                'year' => 2021,
                'title' => 'Contingent workforce management',
                'description' => 'Started operations in staff augmentation and testing across medical devices, mobile and web apps, and telecom.',
            ],
            [
                'year' => 2023,
                'title' => 'Custom software development, ServiceNow',
                'description' => 'Expanded into iOS and Android development with manual and automation testing, and advanced into the ServiceNow ecosystem.',
            ],
            [
                'year' => 2025,
                'title' => 'AI & agentic automation',
                'description' => 'AI-led transformation and custom application development for automating business requirements, with Emiac Technologies as AI enablement partner.',
            ],
            [
                'year' => 2026,
                'title' => 'GCC talent & capability enablement',
                'description' => 'AI-enabled GCC talent programmes, multidisciplinary capability pods, and managed workforce support.',
            ],
        ];

        foreach ($milestones as $order => $data) {
            CompanyMilestone::updateOrCreate(
                ['year' => $data['year'], 'title' => $data['title']],
                [...$data, 'sort_order' => $order],
            );
        }
    }

    private function seedPartners(): void
    {
        $partners = [
            'Stryker', 'Tata', 'Vocera', 'BT', 'Ananta Systems', 'QuestLabs',
            'WillWare', 'Menhood', 'Ananttam', 'Squire Technologies',
        ];

        foreach ($partners as $order => $name) {
            Partner::updateOrCreate(
                ['name' => $name, 'partner_type' => 'alliance'],
                ['sort_order' => $order, 'status' => 'draft'],
            );
        }
    }

    private function seedNewsroom(): void
    {
        $template = PageTemplate::where('key_name', 'company-newsroom')->first();
        if (!$template) {
            return;
        }

        $page = Page::updateOrCreate(
            ['url_path' => '/company/newsroom'],
            [
                'page_template_id' => $template->id,
                'title' => 'Newsroom',
                'status' => 'published',
                'published_at' => now(),
            ],
        );

        $page->sections()->updateOrCreate(
            ['section_key' => 'hero'],
            [
                'content' => [
                    'eyebrow' => 'Newsroom',
                    'title' => 'News and announcements',
                    'description' => 'Press releases, media mentions, and award announcements will be published here as they happen.',
                ],
                'sort_order' => 0,
                'is_visible' => true,
            ],
        );
    }

    private function seedEsg(): void
    {
        $template = PageTemplate::where('key_name', 'company-esg')->first();
        if (!$template) {
            return;
        }

        $page = Page::updateOrCreate(
            ['url_path' => '/company/esg'],
            [
                'page_template_id' => $template->id,
                'title' => 'ESG & Community',
                'status' => 'published',
                'published_at' => now(),
            ],
        );

        $page->sections()->updateOrCreate(
            ['section_key' => 'hero'],
            [
                'content' => [
                    'eyebrow' => 'ESG & Community',
                    'title' => 'Environmental, social, and governance commitments',
                    'description' => 'TeamBees delivers technology for the energy sector while holding itself to the same operational and reporting standards it builds for clients. Specific commitments and community programs will be published here as they are finalized.',
                ],
                'sort_order' => 0,
                'is_visible' => true,
            ],
        );
    }
}
