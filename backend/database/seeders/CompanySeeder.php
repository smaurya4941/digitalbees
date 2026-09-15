<?php

namespace Database\Seeders;

use App\Modules\Company\Models\CompanyMilestone;
use App\Modules\Page\Models\Page;
use App\Modules\Page\Models\PageTemplate;
use Illuminate\Database\Seeder;

/**
 * The five Company sub-pages (blueprint §26.1), replacing the retired
 * `AboutPageSeeder` and its single `/about-us` page (which also carried two
 * fabricated named testimonials — not carried forward here; see
 * TestimonialSeeder's anonymized-attribution convention instead).
 *
 * Deliberately does NOT seed `team_members` (Leadership) or `partners`
 * (Partnerships): unlike a testimonial, there is no honest anonymized
 * version of "who are your executives" or "are you a certified ServiceNow
 * partner" — inventing named executives or real third-party certification
 * claims would be a materially different kind of fabrication than an
 * anonymized quote. Both endpoints and their frontend pages are fully wired
 * against real tables; they render an empty state until real data is
 * entered via the admin CMS, matching this project's existing convention
 * for Insights/Resources/Careers before they had content. Idempotent.
 */
class CompanySeeder extends Seeder
{
    public function run(): void
    {
        $this->seedMilestones();
        $this->seedNewsroom();
        $this->seedEsg();
    }

    private function seedMilestones(): void
    {
        $milestones = [
            [
                'year' => 2015,
                'title' => 'Founded as a specialist staffing firm',
                'description' => 'TeamBees started as a technology staffing company, placing specialists into fast-moving engineering teams. [validate: founding year and narrative pending confirmation from leadership]',
            ],
            [
                'year' => 2019,
                'title' => 'Delivery capability added alongside staffing',
                'description' => 'The practice model expanded beyond placements into full delivery — the combination that became Digital, Quality, and ServiceNow Bees. [validate: expansion timeline pending confirmation]',
            ],
            [
                'year' => 2022,
                'title' => 'AI Bees and Energy Bees launched',
                'description' => 'Two specialist practices launched to match where clients needed the deepest technical depth: applied AI and energy trading platforms. [validate: launch year pending confirmation]',
            ],
            [
                'year' => 2025,
                'title' => 'Seven practices, six regions',
                'description' => 'TeamBees today: seven specialist practices operating across the USA, UK, Europe, Canada, Australia, and UAE. [validate: current regional footprint pending confirmation]',
            ],
        ];

        foreach ($milestones as $order => $data) {
            CompanyMilestone::updateOrCreate(
                ['year' => $data['year'], 'title' => $data['title']],
                [...$data, 'sort_order' => $order],
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
