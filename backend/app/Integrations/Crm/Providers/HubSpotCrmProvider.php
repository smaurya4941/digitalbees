<?php

namespace App\Integrations\Crm\Providers;

use App\Integrations\Crm\Contracts\CrmClient;
use App\Modules\Lead\Models\Lead;
use Illuminate\Support\Facades\Http;
use RuntimeException;

/**
 * HubSpot Contacts API client (blueprint §34.1 default CRM). Field-mapping
 * per blueprint §34.2: `full_name` splits into firstname/lastname, `company`
 * maps directly, practice/region become custom contact properties (must be
 * created once in the HubSpot portal as `teambees_practice`/
 * `teambees_region` — this client does not provision them), and every UTM
 * key becomes its own `utm_*` property.
 */
class HubSpotCrmProvider implements CrmClient
{
    public function __construct(
        private readonly string $apiKey,
        private readonly string $baseUrl,
    ) {}

    public function sync(Lead $lead): array
    {
        $response = Http::withToken($this->apiKey)
            ->baseUrl($this->baseUrl)
            ->post('/crm/v3/objects/contacts', [
                'properties' => $this->mapProperties($lead),
            ]);

        if ($response->failed()) {
            throw new RuntimeException(
                "HubSpot sync failed for lead [{$lead->id}]: {$response->status()} {$response->body()}",
            );
        }

        $body = $response->json();

        return [
            'reference_id' => $body['id'] ?? null,
            'response' => $body,
        ];
    }

    /** @return array<string, mixed> */
    private function mapProperties(Lead $lead): array
    {
        [$firstName, $lastName] = $this->splitName($lead->full_name);

        $properties = array_filter([
            'email' => $lead->email,
            'firstname' => $firstName,
            'lastname' => $lastName,
            'phone' => $lead->phone,
            'company' => $lead->company,
            'message' => $lead->message,
            'teambees_form_type' => $lead->form_type,
            'teambees_practice' => $lead->practice?->slug,
            'teambees_region' => $lead->region?->slug,
            'teambees_lead_score' => (string) $lead->score,
        ], fn ($value) => $value !== null && $value !== '');

        foreach ((array) $lead->utm as $key => $value) {
            if ($value !== null && $value !== '') {
                $properties["utm_{$key}"] = (string) $value;
            }
        }

        return $properties;
    }

    /** @return array{0: string, 1: string|null} */
    private function splitName(string $fullName): array
    {
        $parts = preg_split('/\s+/', trim($fullName), 2);

        return [$parts[0] ?? $fullName, $parts[1] ?? null];
    }
}
