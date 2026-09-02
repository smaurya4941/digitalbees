<?php

namespace Database\Seeders;

use App\Modules\Page\Models\PageTemplate;
use Illuminate\Database\Seeder;

/**
 * The template matrix — see information-architecture.md §2. `blade_view` stores
 * the frontend template key (features/<domain>/components/<Key>Template).
 */
class PageTemplateSeeder extends Seeder
{
    public function run(): void
    {
        $templates = [
            ['home', 'HomeTemplate', 'Homepage'],
            ['practice-index', 'PracticeIndexTemplate', 'Practices hub'],
            ['practice', 'PracticeTemplate', 'Single practice'],
            ['sub-service', 'SubServiceTemplate', 'Practice sub-service'],
            ['industry-index', 'IndustryIndexTemplate', 'Industries hub'],
            ['industry', 'IndustryTemplate', 'Single industry'],
            ['industry-practice', 'IndustryPracticeTemplate', 'Industry x Practice (curated)'],
            ['region-index', 'RegionIndexTemplate', 'Regions hub'],
            ['region', 'RegionTemplate', 'Single region'],
            ['region-practice', 'RegionPracticeTemplate', 'Region x Practice (curated)'],
            ['technology-index', 'TechnologyIndexTemplate', 'Technologies hub'],
            ['technology', 'TechnologyTemplate', 'Single technology'],
            ['case-study-index', 'CaseStudyIndexTemplate', 'Case studies hub'],
            ['case-study', 'CaseStudyTemplate', 'Single case study'],
            ['insight-index', 'InsightIndexTemplate', 'Insights hub (blog)'],
            ['insight', 'InsightTemplate', 'Single insight'],
            ['resource-index', 'ResourceIndexTemplate', 'Resources hub'],
            ['resource', 'ResourceTemplate', 'Single resource'],
            ['career-index', 'CareerIndexTemplate', 'Careers hub'],
            ['career', 'CareerTemplate', 'Single job posting'],
            ['location-index', 'LocationIndexTemplate', 'Locations hub'],
            ['location', 'LocationTemplate', 'Single location'],
            ['about', 'AboutTemplate', 'About page'],
            ['contact', 'ContactTemplate', 'Contact page'],
            ['search', 'SearchTemplate', 'Search results (noindex)'],
            ['legal', 'LegalTemplate', 'Privacy / Terms'],
            ['error', 'ErrorTemplate', '404 / 500 (noindex)'],
        ];

        foreach ($templates as [$key, $view, $description]) {
            PageTemplate::updateOrCreate(
                ['key_name' => $key],
                ['blade_view' => $view, 'description' => $description],
            );
        }
    }
}
