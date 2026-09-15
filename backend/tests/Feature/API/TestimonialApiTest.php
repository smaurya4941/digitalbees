<?php

namespace Tests\Feature\API;

use Database\Seeders\TestimonialSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TestimonialApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_lists_published_testimonials(): void
    {
        $this->seed(TestimonialSeeder::class);

        $response = $this->getJson('/api/v1/testimonials');

        $response->assertOk();
        $this->assertGreaterThanOrEqual(3, count($response->json('data')));
        $this->assertArrayHasKey('quote', $response->json('data.0'));
    }

    public function test_it_filters_by_related_type(): void
    {
        $this->seed(TestimonialSeeder::class);

        $response = $this->getJson('/api/v1/testimonials?related_type=careers');

        $response->assertOk();
        foreach ($response->json('data') as $testimonial) {
            $this->assertSame('AI Engineer', $testimonial['author_title']);
        }
    }

    public function test_an_unpublished_testimonial_is_not_returned(): void
    {
        \App\Modules\Testimonial\Models\Testimonial::create([
            'quote' => 'Draft quote, not ready.',
            'author_title' => 'Someone',
            'related_type' => 'home',
            'status' => 'draft',
            'sort_order' => 0,
        ]);

        $response = $this->getJson('/api/v1/testimonials');

        $response->assertOk();
        $quotes = collect($response->json('data'))->pluck('quote');
        $this->assertFalse($quotes->contains('Draft quote, not ready.'));
    }
}
