<?php

namespace Database\Seeders;

use App\Modules\Industry\Models\Industry;
use App\Modules\Practice\Models\Practice;
use App\Modules\Region\Models\Region;
use App\Modules\Technology\Models\Technology;
use App\Support\Models\EntityRelation;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Seeder;

/**
 * A starter content graph — see information-architecture.md §4. Demonstrates the
 * relationship model; editors extend it from the CMS. Idempotent.
 */
class EntityRelationSeeder extends Seeder
{
    /** @var array<string, Model> */
    private array $cache = [];

    public function run(): void
    {
        // practice => [industries, technologies, regions]
        $graph = [
            'ai-bees' => [
                'industries' => ['healthcare', 'banking-financial-services', 'retail-ecommerce', 'insurance'],
                'technologies' => ['openai', 'aws', 'microsoft-azure', 'databricks'],
                'regions' => ['usa', 'uk', 'uae'],
            ],
            'digital-bees' => [
                'industries' => ['banking-financial-services', 'technology-software', 'public-sector', 'manufacturing'],
                'technologies' => ['aws', 'microsoft-azure', 'google-cloud', 'kubernetes', 'react', 'laravel'],
                'regions' => ['usa', 'uk', 'europe', 'canada'],
            ],
            'talent-bees' => [
                'industries' => ['technology-software', 'banking-financial-services', 'telecom'],
                'technologies' => ['react', 'aws', 'kubernetes'],
                'regions' => ['usa', 'uk', 'europe', 'canada', 'australia'],
            ],
            'quality-bees' => [
                'industries' => ['banking-financial-services', 'insurance', 'public-sector', 'telecom'],
                'technologies' => ['kubernetes', 'terraform'],
                'regions' => ['uk', 'europe', 'australia'],
            ],
            'servicenow-bees' => [
                'industries' => ['public-sector', 'banking-financial-services', 'technology-software', 'telecom'],
                'technologies' => ['servicenow', 'salesforce'],
                'regions' => ['usa', 'uk', 'australia'],
            ],
            'marketing-bees' => [
                'industries' => ['retail-ecommerce', 'technology-software', 'healthcare'],
                'technologies' => ['salesforce', 'react'],
                'regions' => ['usa', 'uk'],
            ],
            'energy-bees' => [
                'industries' => ['energy-utilities', 'manufacturing', 'logistics-supply-chain'],
                'technologies' => ['aws', 'snowflake', 'databricks', 'terraform'],
                'regions' => ['uk', 'europe', 'uae', 'australia'],
            ],
        ];

        foreach ($graph as $practiceSlug => $links) {
            $practice = $this->find(Practice::class, $practiceSlug);

            if ($practice === null) {
                continue;
            }

            $this->link($practice, Industry::class, $links['industries'], 'serves');
            $this->link($practice, Technology::class, $links['technologies'], 'built-with');
            $this->link($practice, Region::class, $links['regions'], 'delivered-in');
        }
    }

    /**
     * @param  class-string<Model>  $relatedClass
     * @param  list<string>  $slugs
     */
    private function link(Model $subject, string $relatedClass, array $slugs, string $relationType): void
    {
        foreach (array_values($slugs) as $order => $slug) {
            $related = $this->find($relatedClass, $slug);

            if ($related === null) {
                continue;
            }

            EntityRelation::updateOrCreate(
                [
                    'subject_type' => $subject->getMorphClass(),
                    'subject_id' => $subject->getKey(),
                    'related_type' => $related->getMorphClass(),
                    'related_id' => $related->getKey(),
                    'relation_type' => $relationType,
                ],
                ['sort_order' => $order],
            );
        }
    }

    /** @param  class-string<Model>  $class */
    private function find(string $class, string $slug): ?Model
    {
        return $this->cache["{$class}:{$slug}"] ??= $class::query()->where('slug', $slug)->first();
    }
}
