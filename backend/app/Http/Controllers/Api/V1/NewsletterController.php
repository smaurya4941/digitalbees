<?php

namespace App\Http\Controllers\Api\V1;

use App\Modules\Lead\Models\NewsletterSubscriber;
use App\Modules\Page\Models\Page;
use App\Support\Http\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Newsletter signup (blueprint §11.4, §32.2): zero-friction by design — one
 * field, one click, no sales gate. Upserts by email so a resubscribe after
 * unsubscribing just flips the status back rather than erroring on the
 * unique constraint.
 */
class NewsletterController extends ApiController
{
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'email' => ['required', 'email', 'max:150'],
            'source_path' => ['nullable', 'string', 'max:500'],
            'company_website' => ['prohibited'], // honeypot
        ]);

        $sourcePageId = filled($data['source_path'] ?? null)
            ? Page::query()->where('url_path', $data['source_path'])->value('id')
            : null;

        NewsletterSubscriber::updateOrCreate(
            ['email' => $data['email']],
            ['status' => 'subscribed', 'source_page_id' => $sourcePageId, 'created_at' => now()],
        );

        return ApiResponse::accepted(['status' => 'success']);
    }
}
