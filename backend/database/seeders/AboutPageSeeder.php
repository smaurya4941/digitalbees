<?php

namespace Database\Seeders;

use App\Modules\Page\Models\Page;
use App\Modules\Page\Models\PageSection;
use App\Modules\Page\Models\PageTemplate;
use Illuminate\Database\Seeder;

class AboutPageSeeder extends Seeder
{
    public function run(): void
    {
        $template = PageTemplate::firstOrCreate(
            ['key_name' => 'about_us'],
            ['blade_view' => 'about_us', 'description' => 'About Us Page Template']
        );

        $page = Page::firstOrCreate(
            ['url_path' => '/about-us'],
            [
                'page_template_id' => $template->id,
                'title' => 'About Us | The Digital Bees',
                'status' => 'published',
                'published_at' => now(),
            ]
        );

        $sections = [
            'hero' => [
                'title' => 'Our Commitment',
                'description' => 'Our commitment to bridging the gap between digital workforce solutions and exceptional talent is unwavering.',
                'image_url' => 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop',
            ],
            'features' => [
                [
                    'title' => 'Curated Talent Pool',
                    'description' => 'We meticulously vet our digital experts to ensure they possess the skills and experience necessary to drive your business forward.',
                    'icon' => 'Users',
                ],
                [
                    'title' => 'Rapid Deployment',
                    'description' => 'Time is of the essence. Our pre-trained professionals are ready to integrate seamlessly into your team, accelerating your project timelines.',
                    'icon' => 'Zap',
                ],
                [
                    'title' => 'Tailored Solutions',
                    'description' => 'Every business is unique. We provide customized workforce solutions that align perfectly with your specific goals and requirements.',
                    'icon' => 'Target',
                ],
                [
                    'title' => 'Ongoing Support',
                    'description' => 'Our commitment doesn\'t end with deployment. We offer continuous support to ensure sustained performance and satisfaction.',
                    'icon' => 'LifeBuoy',
                ]
            ],
            'banner' => [
                'headline' => 'Ready to transform your digital workforce?',
                'cta_text' => 'Get in Touch',
                'cta_link' => '/contact-us',
            ],
            'testimonials' => [
                [
                    'quote' => 'The Digital Bees provided us with exceptional talent that seamlessly integrated into our team and accelerated our product launch.',
                    'author' => 'Sarah Johnson',
                    'role' => 'CTO, TechInnovate',
                ],
                [
                    'quote' => 'Their curated pool of professionals is unmatched. We found exactly the right experts for our complex digital transformation project.',
                    'author' => 'Michael Chen',
                    'role' => 'Director of Engineering, GlobalCorp',
                ]
            ],
            'why_work_with_us' => [
                'headline' => 'Why Partner With The Digital Bees?',
                'points' => [
                    'Access to top-tier, pre-vetted digital professionals.',
                    'Flexible engagement models to suit your project needs.',
                    'Reduced hiring time and onboarding costs.',
                    'Focus on cultural fit and long-term success.',
                    'Dedicated account management and support.'
                ]
            ]
        ];

        foreach ($sections as $key => $content) {
            PageSection::updateOrCreate(
                ['page_id' => $page->id, 'section_key' => $key],
                ['content' => $content, 'is_visible' => true]
            );
        }
    }
}
