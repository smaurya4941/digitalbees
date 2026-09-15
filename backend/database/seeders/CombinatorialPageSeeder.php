<?php

namespace Database\Seeders;

use App\Modules\Industry\Models\Industry;
use App\Modules\Page\Models\Page;
use App\Modules\Page\Models\PageTemplate;
use App\Modules\Practice\Models\Practice;
use App\Modules\Region\Models\Region;
use Illuminate\Database\Seeder;

/**
 * Curated Practice x Industry / Region x Practice pages (blueprint §7.2's
 * anti-thin-content rule: a combinatorial URL is only ever indexable when a
 * `pages` row has been explicitly authored for it — see IA doc §5 rule 4 and
 * §7). Every other combination of the taxonomy correctly 404s through
 * PageResolutionService; only these curated pairs exist. Copy draws on
 * blueprint Appendix C.3 (Energy Bees) and Appendix C.4 (UAE). Idempotent.
 */
class CombinatorialPageSeeder extends Seeder
{
    public function run(): void
    {
        $industryPractice = PageTemplate::where('key_name', 'industry-practice')->first();
        $regionPractice = PageTemplate::where('key_name', 'region-practice')->first();

        if (!$industryPractice || !$regionPractice) {
            return; // PageTemplateSeeder must run first.
        }

        $this->seedIndustryPractice($industryPractice, 'energy-utilities', 'energy-bees', [
            'title' => 'Energy Bees for Energy, Oil & Gas, and Utilities',
            'hero' => [
                'eyebrow' => 'Energy, Oil & Gas, and Utilities',
                'title' => 'Specialist Energy Bees delivery for energy, oil & gas, and utilities',
                'description' => 'Trading-platform depth (Endur, Allegro, RightAngle, TriplePoint), regulatory reporting accuracy, and modernization of control-room and back-office systems — from people who know the platforms and the market.',
            ],
            'why_it_matters' => "Energy trading platforms fail quietly when the people implementing them don't understand the trading and risk workflows underneath the screens. Energy Bees consultants come from a mix of platform-implementation and trading-operations backgrounds, so configuration decisions get made with the desk's actual workflow in mind, not just the vendor's default setup. `[validate]`: exact deployment-count and consultant-certification figures pending confirmation from TeamBees leadership.",
        ]);

        $this->seedIndustryPractice($industryPractice, 'healthcare', 'ai-bees', [
            'title' => 'AI Bees for Healthcare & Life Sciences',
            'hero' => [
                'eyebrow' => 'Healthcare & Life Sciences',
                'title' => 'Production AI for healthcare & life sciences',
                'description' => 'Interoperability across fragmented systems, HIPAA/GDPR-aware data handling, and clinician-facing AI that can\'t afford friction — built by teams who ship AI into real production systems, not just prototypes.',
            ],
            'why_it_matters' => "Healthcare AI initiatives stall for a different reason than most industries: the data is fragmented across systems that were never designed to talk to each other, and every integration point carries a compliance requirement. AI Bees scopes for that reality from day one — evaluation, guardrails, and monitoring are part of the first sprint, not a pre-launch checklist item. `[validate]`: patient-outcome and efficiency figures pending a named case study.",
        ]);

        $this->seedRegionPractice($regionPractice, 'uae', 'talent-bees', [
            'title' => 'Talent Bees in the UAE',
            'hero' => [
                'eyebrow' => 'UAE',
                'title' => 'TeamBees in the UAE — Talent built for how the region actually hires',
                'description' => 'Emiratization-aware staffing, free zone and mainland hiring expertise, and delivery teams who understand the pace enterprise and government projects move at here.',
            ],
            'why_it_matters' => 'Emiratization compliance is built into workforce planning from the start — helping clients meet quota requirements with genuinely qualified UAE national talent, not last-minute box-ticking. TeamBees also helps clients navigate the practical differences between free zone and mainland hiring structures so the right legal setup is in place before a single offer goes out. `[validate]`: regional placement-volume figures pending confirmation from TeamBees leadership.',
        ]);
    }

    /** @param array{title: string, hero: array<string, string>, why_it_matters: string} $content */
    private function seedIndustryPractice(PageTemplate $template, string $industrySlug, string $practiceSlug, array $content): void
    {
        $industry = Industry::where('slug', $industrySlug)->first();
        $practice = Practice::where('slug', $practiceSlug)->first();

        if (!$industry || !$practice) {
            return;
        }

        $this->seedPage($template, "/industries/{$industrySlug}/{$practiceSlug}", 'industry', $industry->id, 'practice', $practice->id, $content);
    }

    /** @param array{title: string, hero: array<string, string>, why_it_matters: string} $content */
    private function seedRegionPractice(PageTemplate $template, string $regionSlug, string $practiceSlug, array $content): void
    {
        $region = Region::where('slug', $regionSlug)->first();
        $practice = Practice::where('slug', $practiceSlug)->first();

        if (!$region || !$practice) {
            return;
        }

        $this->seedPage($template, "/regions/{$regionSlug}/{$practiceSlug}", 'region', $region->id, 'practice', $practice->id, $content);
    }

    /** @param array{title: string, hero: array<string, string>, why_it_matters: string} $content */
    private function seedPage(
        PageTemplate $template,
        string $urlPath,
        string $primaryType,
        int $primaryId,
        string $secondaryType,
        int $secondaryId,
        array $content,
    ): void {
        $page = Page::updateOrCreate(
            ['url_path' => $urlPath],
            [
                'page_template_id' => $template->id,
                'pageable_type' => $primaryType,
                'pageable_id' => $primaryId,
                'secondary_type' => $secondaryType,
                'secondary_id' => $secondaryId,
                'title' => $content['title'],
                'status' => 'published',
                'published_at' => now(),
            ],
        );

        $page->sections()->updateOrCreate(
            ['section_key' => 'hero'],
            ['content' => $content['hero'], 'sort_order' => 0, 'is_visible' => true],
        );

        $page->sections()->updateOrCreate(
            ['section_key' => 'why_it_matters'],
            ['content' => ['body' => $content['why_it_matters']], 'sort_order' => 1, 'is_visible' => true],
        );
    }
}
