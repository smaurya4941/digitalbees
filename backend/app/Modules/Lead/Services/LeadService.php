<?php

namespace App\Modules\Lead\Services;

use App\Integrations\Crm\Jobs\SyncLeadToCrm;
use App\Modules\Lead\Http\Requests\StoreLeadRequest;
use App\Modules\Lead\Models\Lead;
use App\Modules\Page\Models\Page;
use App\Modules\Practice\Models\Practice;
use App\Modules\Region\Models\Region;

/**
 * Application use-case for capturing a public lead submission (blueprint
 * §28.2's conversion flows all land here, differentiated by `form_type`):
 * persist, score, then hand off to the CRM sync job.
 */
class LeadService
{
    public function __construct(private readonly LeadScoringService $scoring) {}

    public function capture(StoreLeadRequest $request): Lead
    {
        $data = $request->validated();

        $lead = Lead::create([
            'full_name' => $data['full_name'],
            'email' => $data['email'],
            'phone' => $data['phone'] ?? null,
            'company' => $data['company'] ?? null,
            'message' => $data['message'] ?? null,
            'form_type' => $data['form_type'],
            'source_page_id' => $this->resolveSourcePageId($data['source_path'] ?? null),
            'practice_id' => $this->resolveId(Practice::class, $data['practice_slug'] ?? null),
            'region_id' => $this->resolveId(Region::class, $data['region_slug'] ?? null),
            'utm' => $data['utm'] ?? null,
            'ip_address' => $request->ip(),
        ]);

        $lead->update(['score' => $this->scoring->score($lead)]);

        SyncLeadToCrm::dispatch($lead);

        return $lead;
    }

    /**
     * A `source_path` only maps to a real row when the page is CMS-backed
     * (a `pages` entry — combinatorial or simple CMS pages). Most content
     * pages (practices, industries, ...) aren't `pages` rows, so this is
     * `null` for the majority of submissions — an honest gap, not a bug: we
     * never fabricate a page reference that doesn't exist.
     */
    private function resolveSourcePageId(?string $path): ?int
    {
        if ($path === null || $path === '') {
            return null;
        }

        return Page::query()->where('url_path', $path)->value('id');
    }

    /** @param  class-string<Practice|Region>  $class */
    private function resolveId(string $class, ?string $slug): ?int
    {
        if ($slug === null || $slug === '') {
            return null;
        }

        return $class::query()->where('slug', $slug)->value('id');
    }
}
