<?php

namespace Database\Seeders;

use App\Modules\Faq\Models\Faq;
use Illuminate\Database\Seeder;

/**
 * General (unattached) FAQs shown on the services hub via `GET /faqs`.
 * Formerly hard-coded in the frontend's ServicesFAQ; now admin-managed.
 * Idempotent — keyed on the question text.
 */
class GeneralFaqSeeder extends Seeder
{
    public function run(): void
    {
        $faqs = [
            [
                'question' => 'How is your model different from hiring traditional freelancers?',
                'answer' => 'Freelancers often pose risks regarding consistency, quality, and sudden availability drops. We provide fully dedicated, pre-trained professionals who work exclusively for your brand under strict accountability, backed by a managed ecosystem.',
            ],
            [
                'question' => "What is your replacement policy if a resource doesn't fit?",
                'answer' => "We offer a swift replacement guarantee. If a resource isn't the right fit for your team, we'll provide a fully-trained replacement within days, ensuring minimal disruption to your workflow.",
            ],
            [
                'question' => 'How do you ensure your talent stays updated with changing digital tools?',
                'answer' => 'Our professionals undergo continuous upskilling and certification through our internal AI ecosystem, ensuring they remain at the cutting edge of industry tools and best practices.',
            ],
            [
                'question' => 'Is this model truly cost-effective compared to traditional hiring?',
                'answer' => 'Yes. By eliminating local recruitment fees, HR overhead, benefits, and office space costs, our clients typically save up to 40% while maintaining the exact same output quality and dedication.',
            ],
            [
                'question' => 'How do you handle data security and intellectual property (IP) protection?',
                'answer' => 'Security is built into our core. All our professionals sign strict NDAs, operate on secure, monitored networks, and follow enterprise-grade data protection protocols to ensure your IP remains completely secure.',
            ],
        ];

        foreach ($faqs as $order => $data) {
            Faq::updateOrCreate(
                ['question' => $data['question'], 'faqable_type' => null],
                [...$data, 'faqable_id' => null, 'sort_order' => $order, 'status' => 'published'],
            );
        }
    }
}
