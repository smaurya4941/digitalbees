<?php

namespace App\Modules\Seo\Services;

use App\Support\Enums\ContentStatus;
use Illuminate\Database\Eloquent\Model;

/**
 * Static SEO checks for a single content entity. Returns a flat list of
 * warnings the admin UI renders inline and on the site-wide SEO screen.
 */
final class SeoLintService
{
    private const TITLE_MIN = 30;

    private const TITLE_MAX = 60;

    private const DESC_MIN = 70;

    private const DESC_MAX = 160;

    /** @return list<array{level: string, field: string, message: string}> */
    public function lint(Model $model): array
    {
        $seo = $model->relationLoaded('seo') ? $model->seo : $model->seo()->first();
        $published = $this->statusValue($model) === ContentStatus::Published->value;
        $out = [];

        $title = $seo?->meta_title;
        if (blank($title)) {
            $out[] = $this->warn('meta_title', 'Meta title is missing.');
        } elseif (mb_strlen($title) < self::TITLE_MIN) {
            $out[] = $this->warn('meta_title', 'Meta title is shorter than '.self::TITLE_MIN.' characters.');
        } elseif (mb_strlen($title) > self::TITLE_MAX) {
            $out[] = $this->warn('meta_title', 'Meta title is longer than '.self::TITLE_MAX.' characters and may be truncated.');
        }

        $desc = $seo?->meta_description;
        if (blank($desc)) {
            $out[] = $this->warn('meta_description', 'Meta description is missing.');
        } elseif (mb_strlen($desc) < self::DESC_MIN) {
            $out[] = $this->warn('meta_description', 'Meta description is shorter than '.self::DESC_MIN.' characters.');
        } elseif (mb_strlen($desc) > self::DESC_MAX) {
            $out[] = $this->warn('meta_description', 'Meta description is longer than '.self::DESC_MAX.' characters and may be truncated.');
        }

        if ($published && blank($seo?->og_image_id)) {
            $out[] = $this->warn('og_image_id', 'No social share image set for a published page.');
        }

        if ($published && $seo && str_contains((string) $seo->robots, 'noindex')) {
            $out[] = ['level' => 'error', 'field' => 'robots', 'message' => 'This published page is set to noindex.'];
        }

        return $out;
    }

    private function warn(string $field, string $message): array
    {
        return ['level' => 'warn', 'field' => $field, 'message' => $message];
    }

    private function statusValue(Model $model): ?string
    {
        $status = $model->getAttribute('status');

        return $status instanceof ContentStatus ? $status->value : $status;
    }
}
