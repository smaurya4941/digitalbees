<?php

namespace Database\Seeders;

use App\Modules\Testimonial\Models\Testimonial;
use Illuminate\Database\Seeder;

/**
 * Starter testimonial content (blueprint §10.1/§10.2/§10.3). No named
 * individual or company here is a real client — until real, signed-off
 * quotes exist, every entry uses the blueprint's own anonymized-composite
 * convention (§10.3: "A top-5 US energy trading firm...", not a fabricated
 * named person) rather than inventing a fake CIO or engineer. Replace with
 * real, attributed quotes as they're cleared by client-relations. Idempotent.
 */
class TestimonialSeeder extends Seeder
{
    public function run(): void
    {
        $testimonials = [
            [
                'related_type' => 'home',
                'related_id' => null,
                'quote' => "TeamBees was the only partner who could deliver production ServiceNow work while simultaneously scaling our internal delivery pod with compliant, high-quality contract talent — they don't just supply resumes, they supply velocity.",
                'author_name' => null,
                'author_title' => 'Chief Information Officer',
                'author_company' => 'A top-10 global financial services firm',
            ],
            [
                'related_type' => 'home',
                'related_id' => null,
                'quote' => 'We needed an AI agent in production, not another slide deck. TeamBees scoped it, built it, and had guardrails and monitoring live before we asked for them.',
                'author_name' => null,
                'author_title' => 'VP of Engineering',
                'author_company' => 'A mid-market SaaS company',
            ],
            [
                'related_type' => 'careers',
                'related_id' => null,
                'quote' => 'I joined TeamBees to work on harder problems. Within six months I was on an LLM orchestration build for a top-tier bank — real production work, not a bench assignment.',
                'author_name' => null,
                'author_title' => 'AI Engineer',
                'author_company' => 'TeamBees, London',
            ],
            // Formerly hard-coded in the homepage proof carousel; now admin-managed.
            [
                'related_type' => 'home',
                'related_id' => null,
                'quote' => 'Teams recovered 45–60 minutes per person, per day through governed multi-agent finance workflow automation connecting our transaction ledgers.',
                'author_name' => null,
                'author_title' => 'Enterprise Finance Team',
                'author_company' => 'Financial Services Leader',
            ],
            [
                'related_type' => 'home',
                'related_id' => null,
                'quote' => 'Delivered 10-domain HRMS modernization with automated onboarding, dynamic credentialing, and real-time compliance reporting in under 12 weeks.',
                'author_name' => null,
                'author_title' => 'VP People Systems',
                'author_company' => 'Enterprise SaaS Client',
            ],
            [
                'related_type' => 'home',
                'related_id' => null,
                'quote' => 'Reduced regression testing cycles by 65% with self-healing UI test automation across our continuous production release pipeline.',
                'author_name' => null,
                'author_title' => 'Head of Quality Engineering',
                'author_company' => 'Global Technology Brand',
            ],
            [
                'related_type' => 'home',
                'related_id' => null,
                'quote' => 'Standardized enterprise CMDB and CSDM architecture across complex transit infrastructure within 90 days with zero operational downtime.',
                'author_name' => null,
                'author_title' => 'Director of Service Operations',
                'author_company' => 'Transport & Infrastructure Client',
            ],
        ];

        foreach ($testimonials as $order => $data) {
            Testimonial::updateOrCreate(
                ['quote' => $data['quote']],
                [...$data, 'sort_order' => $order, 'status' => 'published'],
            );
        }
    }
}
