<?php

namespace App\Modules\Lead\Services;

use App\Modules\Lead\Models\Lead;

/**
 * Blueprint §8.2's lead-scoring rubric, applied to what a `Lead` row can
 * actually tell us today — see config/lead_scoring.php's docblock for which
 * blueprint signals need enrichment/analytics this system doesn't have yet.
 */
class LeadScoringService
{
    public function score(Lead $lead): int
    {
        $weights = config('lead_scoring');
        $score = 0;

        $score += $weights['form_type'][$lead->form_type] ?? 0;

        if (filled($lead->company)) {
            $score += $weights['has_company'];
        }

        if (mb_strlen((string) $lead->message) >= $weights['substantive_message_min_length']) {
            $score += $weights['substantive_message'];
        }

        if ($lead->practice_id !== null) {
            $score += $weights['has_practice'];
        }

        if ($lead->region_id !== null) {
            $score += $weights['has_region'];
        }

        if (filled($lead->utm['campaign'] ?? null)) {
            $score += $weights['has_utm_campaign'];
        }

        return $score;
    }

    public function isHot(int $score): bool
    {
        return $score >= config('lead_scoring.hot_lead_threshold');
    }
}
