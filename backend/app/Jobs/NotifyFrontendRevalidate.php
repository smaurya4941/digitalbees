<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

/**
 * Tells the Next.js app to drop specific cache tags after content changes,
 * so published edits go live without waiting for time-based revalidation.
 *
 * Wire this from module Observers / publish Actions, e.g.:
 *   NotifyFrontendRevalidate::dispatch(['practices', "practice:{$practice->slug}"]);
 */
class NotifyFrontendRevalidate implements ShouldQueue
{
    use Dispatchable;
    use InteractsWithQueue;
    use Queueable;
    use SerializesModels;

    /** @param  list<string>  $tags */
    public function __construct(public array $tags) {}

    public function handle(): void
    {
        $url = (string) config('frontend.revalidate.url');
        $secret = (string) config('frontend.revalidate.secret');

        if ($url === '' || $secret === '' || $this->tags === []) {
            Log::info('NotifyFrontendRevalidate skipped (not configured or no tags)', ['tags' => $this->tags]);

            return;
        }

        Http::timeout((int) config('frontend.revalidate.timeout', 5))
            ->withHeaders(['x-revalidate-secret' => $secret])
            ->post($url, ['tags' => array_values(array_unique($this->tags))])
            ->throw();
    }
}
