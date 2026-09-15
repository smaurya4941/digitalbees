<?php

namespace Database\Seeders;

use App\Modules\Technology\Models\Technology;
use App\Support\Enums\ContentStatus;
use Illuminate\Database\Seeder;

/**
 * Technology taxonomy — see information-architecture.md §3.5 and blueprint
 * §24.3's 20-item roadmap (ServiceNow modules, Energy trading platforms,
 * AI/data stack, Digital/cloud stack, QA tooling). Extensible.
 */
class TechnologySeeder extends Seeder
{
    public function run(): void
    {
        $technologies = [
            ['AWS', 'aws', 'Amazon Web Services', 'Cloud infrastructure, migration, and FinOps delivery on AWS.'],
            ['Microsoft Azure', 'microsoft-azure', 'Microsoft', 'Cloud infrastructure and platform engineering on Azure.'],
            ['Google Cloud', 'google-cloud', 'Google', 'Cloud infrastructure and data platform delivery on GCP.'],
            ['OpenAI', 'openai', 'OpenAI', 'LLM integration, fine-tuning, and production agent development on OpenAI models.'],
            ['Databricks', 'databricks', 'Databricks', 'Lakehouse architecture, data engineering, and MLOps on Databricks.'],
            ['Snowflake', 'snowflake', 'Snowflake', 'Cloud data warehouse implementation and analytics engineering on Snowflake.'],
            ['ServiceNow', 'servicenow', 'ServiceNow', 'Certified implementation, development, and staffing across the Now Platform.'],
            ['ServiceNow ITSM', 'servicenow-itsm', 'ServiceNow', 'IT Service Management implementation and process alignment on ServiceNow.'],
            ['ServiceNow CSM', 'servicenow-csm', 'ServiceNow', 'Customer Service Management implementation on ServiceNow.'],
            ['ServiceNow ITOM', 'servicenow-itom', 'ServiceNow', 'IT Operations Management and discovery implementation on ServiceNow.'],
            ['Salesforce', 'salesforce', 'Salesforce', 'CRM implementation, customization, and integration on Salesforce.'],
            ['Kubernetes', 'kubernetes', 'CNCF', 'Container orchestration and platform engineering on Kubernetes.'],
            ['Terraform', 'terraform', 'HashiCorp', 'Infrastructure-as-code delivery and cloud automation with Terraform.'],
            ['React', 'react', 'Meta', 'Modern frontend engineering and product UI development with React.'],
            ['Laravel', 'laravel', 'Laravel', 'PHP application engineering and API development on Laravel.'],
            ['Endur', 'endur', 'OpenLink', 'ETRM/CTRM implementation, integration, and support on OpenLink Endur.'],
            ['Allegro', 'allegro', 'Amphora', 'Commodity trading and risk management implementation on Allegro.'],
            ['RightAngle', 'rightangle', 'ION', 'Energy trading and risk management implementation on RightAngle.'],
            ['TriplePoint', 'triplepoint', 'ION', 'Commodity trading and risk platform implementation on TriplePoint.'],
            ['Playwright', 'playwright', 'Microsoft', 'End-to-end test automation framework design and CI integration with Playwright.'],
        ];

        foreach ($technologies as $order => [$name, $slug, $vendor, $summary]) {
            Technology::updateOrCreate(
                ['slug' => $slug],
                [
                    'name' => $name,
                    'vendor_name' => $vendor,
                    'summary' => $summary,
                    'sort_order' => $order,
                    'status' => ContentStatus::Published->value,
                ],
            );
        }
    }
}
