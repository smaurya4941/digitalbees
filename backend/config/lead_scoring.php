<?php

/**
 * Lead scoring weights (blueprint §8.2). The blueprint's point model is
 * keyed to form/behavioral signals this system doesn't fully have yet
 * (job-title/company-size ICP matching needs a data-enrichment integration,
 * session page-count needs analytics wiring, ABM match needs a target-account
 * list) — those are marked `[validate]` below and left at a conservative
 * default rather than guessed. What *is* directly derivable from a `Lead`
 * row today is scored for real: which form was submitted, whether a company
 * name was given, and whether the message shows real intent (length) rather
 * than a one-line placeholder.
 *
 * Kept as config (not hardcoded in the service) so these are tunable without
 * a deploy once real conversion data exists to validate against.
 */
return [

    // Blueprint's own highest-intent signal is "Book a Consultation" (+40).
    // Our `demo_request` form_type is the closest equivalent to that intent;
    // `contact` is mid-funnel, `newsletter`/`chatbot` are top-of-funnel.
    'form_type' => [
        'demo_request' => 40,
        'contact' => 20,
        'newsletter' => 10,
        'chatbot' => 5,
    ],

    // A named company is a stronger buying signal than an anonymous submission.
    'has_company' => 15,

    // A message longer than a placeholder ("hi", "test") suggests real intent.
    'substantive_message_min_length' => 40,
    'substantive_message' => 10,

    // A practice/region selection means the visitor self-identified a need,
    // not just filled a generic form.
    'has_practice' => 10,
    'has_region' => 5,

    // [validate] — needs a UTM/campaign enrichment source to score reliably;
    // for now, any campaign-tagged traffic gets a small, deliberately
    // conservative bump rather than the blueprint's un-verifiable +25 ABM figure.
    'has_utm_campaign' => 5,

    // Leads scoring at or above this route immediately to a named owner
    // (blueprint §8.2: 60+ = immediate SLA route, 30-59 = nurture,
    // below 30 = nurture-only). Routing itself is CRM-side (HubSpot
    // workflow), not built here — this threshold only affects
    // `Lead::status`/reporting until that integration exists.
    'hot_lead_threshold' => 60,

];
