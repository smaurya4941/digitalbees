<?php

namespace App\Modules\Governance\Services;

use App\Modules\CaseStudy\Models\CaseStudy;
use App\Modules\Industry\Models\Industry;
use App\Modules\Lead\Models\Lead;
use App\Modules\Media\Models\Media;
use App\Modules\Page\Models\Page;
use App\Modules\Practice\Models\Practice;
use App\Modules\Region\Models\Location;
use App\Modules\Region\Models\Region;
use App\Modules\Resource\Models\Resource;
use App\Modules\Technology\Models\Technology;
use App\Support\Enums\ContentStatus;
use App\Support\Models\AuditLog;
use Illuminate\Database\Eloquent\Model;

/**
 * Read model for the back-office dashboard. Pure aggregation — no writes.
 */
final class DashboardService
{
    /** @var array<string, array{0: class-string<Model>, 1: string}> */
    private const CONTENT_TYPES = [
        'practices' => [Practice::class, 'Practices'],
        'industries' => [Industry::class, 'Industries'],
        'regions' => [Region::class, 'Regions'],
        'technologies' => [Technology::class, 'Technologies'],
        'case-studies' => [CaseStudy::class, 'Case studies'],
        'resources' => [Resource::class, 'Resources & insights'],
        'locations' => [Location::class, 'Offices'],
        'pages' => [Page::class, 'Pages'],
    ];

    private const STALE_DRAFT_DAYS = 30;

    /** @return array<string, mixed> */
    public function snapshot(): array
    {
        return [
            'content' => $this->contentCounts(),
            'totals' => $this->totals(),
            'needs_attention' => $this->needsAttention(),
            'recent_activity' => $this->recentActivity(),
            'leads' => $this->leadVolume(),
        ];
    }

    /** @return list<array<string, mixed>> */
    private function contentCounts(): array
    {
        $rows = [];

        foreach (self::CONTENT_TYPES as $key => [$class, $label]) {
            $byStatus = $class::query()
                ->selectRaw('status, COUNT(*) as aggregate')
                ->groupBy('status')
                ->pluck('aggregate', 'status');

            $draft = (int) $byStatus->get(ContentStatus::Draft->value, 0);
            $published = (int) $byStatus->get(ContentStatus::Published->value, 0);
            $archived = (int) $byStatus->get(ContentStatus::Archived->value, 0);

            $rows[] = [
                'type' => $key,
                'label' => $label,
                'draft' => $draft,
                'published' => $published,
                'archived' => $archived,
                'total' => $draft + $published + $archived,
            ];
        }

        return $rows;
    }

    /** @return array<string, int> */
    private function totals(): array
    {
        $content = collect($this->contentCounts());

        return [
            'published' => (int) $content->sum('published'),
            'draft' => (int) $content->sum('draft'),
            'media' => Media::query()->count(),
            'new_leads' => Lead::query()->where('status', 'new')->count(),
        ];
    }

    /** @return list<array<string, mixed>> */
    private function needsAttention(): array
    {
        $items = [];
        $threshold = now()->subDays(self::STALE_DRAFT_DAYS);

        foreach (self::CONTENT_TYPES as $key => [$class, $label]) {
            $stale = $class::query()
                ->where('status', ContentStatus::Draft->value)
                ->where('updated_at', '<', $threshold)
                ->count();

            if ($stale > 0) {
                $items[] = [
                    'type' => $key,
                    'reason' => 'stale_draft',
                    'message' => "{$stale} {$label} draft".($stale === 1 ? '' : 's')
                        .' untouched for over '.self::STALE_DRAFT_DAYS.' days',
                    'count' => $stale,
                ];
            }
        }

        $unstamped = CaseStudy::query()
            ->where('status', ContentStatus::Published->value)
            ->whereNull('published_at')
            ->count();

        if ($unstamped > 0) {
            $items[] = [
                'type' => 'case-studies',
                'reason' => 'missing_publish_date',
                'message' => "{$unstamped} published case ".($unstamped === 1 ? 'study has' : 'studies have').' no publish date',
                'count' => $unstamped,
            ];
        }

        return $items;
    }

    /** @return list<array<string, mixed>> */
    private function recentActivity(): array
    {
        return AuditLog::query()
            ->with('user:id,name')
            ->orderByDesc('id')
            ->limit(8)
            ->get()
            ->map(fn (AuditLog $log) => [
                'id' => $log->id,
                'action' => $log->action,
                'auditable_type' => $log->auditable_type,
                'auditable_id' => $log->auditable_id,
                'user' => $log->user?->name,
                'created_at' => $log->created_at,
            ])
            ->all();
    }

    /** @return array<string, int> */
    private function leadVolume(): array
    {
        return [
            'total' => Lead::query()->count(),
            'new' => Lead::query()->where('status', 'new')->count(),
            'last_7_days' => Lead::query()->where('created_at', '>=', now()->subDays(7))->count(),
            'last_30_days' => Lead::query()->where('created_at', '>=', now()->subDays(30))->count(),
        ];
    }
}
