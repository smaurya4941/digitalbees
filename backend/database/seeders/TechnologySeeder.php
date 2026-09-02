<?php

namespace Database\Seeders;

use App\Modules\Technology\Models\Technology;
use App\Support\Enums\ContentStatus;
use Illuminate\Database\Seeder;

/**
 * Initial technology taxonomy — see information-architecture.md §3.5. Extensible.
 */
class TechnologySeeder extends Seeder
{
    public function run(): void
    {
        $technologies = [
            ['AWS', 'aws', 'Amazon Web Services'],
            ['Microsoft Azure', 'microsoft-azure', 'Microsoft'],
            ['Google Cloud', 'google-cloud', 'Google'],
            ['OpenAI', 'openai', 'OpenAI'],
            ['Databricks', 'databricks', 'Databricks'],
            ['Snowflake', 'snowflake', 'Snowflake'],
            ['ServiceNow', 'servicenow', 'ServiceNow'],
            ['Salesforce', 'salesforce', 'Salesforce'],
            ['Kubernetes', 'kubernetes', 'CNCF'],
            ['Terraform', 'terraform', 'HashiCorp'],
            ['React', 'react', 'Meta'],
            ['Laravel', 'laravel', 'Laravel'],
        ];

        foreach ($technologies as $order => [$name, $slug, $vendor]) {
            Technology::updateOrCreate(
                ['slug' => $slug],
                [
                    'name' => $name,
                    'vendor_name' => $vendor,
                    'summary' => "TeamBees delivery capability and certified talent for {$name}.",
                    'sort_order' => $order,
                    'status' => ContentStatus::Published->value,
                ],
            );
        }
    }
}
