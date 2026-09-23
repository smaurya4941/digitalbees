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

    /**
     * @param  list<string>  $tags
     * @param  list<string>  $paths
     */
    public function __construct(public array $tags, public array $paths = [])
    {
        // Run inline on save rather than on the default (database) queue:
        // production runs no queue worker, so queued jobs never fired and
        // edits only surfaced after the frontend's 1-hour ISR backstop.
        $this->onConnection('sync');
    }

    public function handle(): void
    {
        $url = (string) config('frontend.revalidate.url');
        $secret = (string) config('frontend.revalidate.secret');

        if ($url === '' || $secret === '' || ($this->tags === [] && $this->paths === [])) {
            Log::info('NotifyFrontendRevalidate skipped (not configured or nothing to purge)', [
                'tags' => $this->tags,
                'paths' => $this->paths,
            ]);

            return;
        }

        // Running inline means a frontend hiccup must not fail the admin save
        // (the content is already committed) — log it and let ISR catch up.
        try {
            Http::timeout((int) config('frontend.revalidate.timeout', 5))
                ->withHeaders(['x-revalidate-secret' => $secret])
                ->post($url, [
                    'tags' => array_values(array_unique($this->tags)),
                    'paths' => array_values(array_unique($this->paths)),
                ])
                ->throw();
        } catch (\Throwable $e) {
            Log::warning('NotifyFrontendRevalidate failed', [
                'tags' => $this->tags,
                'paths' => $this->paths,
                'error' => $e->getMessage(),
            ]);
        }
    }
}
