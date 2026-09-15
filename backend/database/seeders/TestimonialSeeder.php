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
        ];

        foreach ($testimonials as $order => $data) {
            Testimonial::updateOrCreate(
                ['quote' => $data['quote']],
                [...$data, 'sort_order' => $order, 'status' => 'published'],
            );
        }
    }
}
