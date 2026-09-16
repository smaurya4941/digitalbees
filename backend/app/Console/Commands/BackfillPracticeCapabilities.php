<?php

namespace App\Console\Commands;

use App\Modules\Practice\Models\Capability;
use App\Modules\Practice\Models\Practice;
use App\Modules\Practice\Models\Workflow;
use Illuminate\Console\Command;

/**
 * One-off, idempotent backfill of `practices.key_capabilities`/
 * `workflow_steps` (legacy JSON columns) into the normalized `capabilities`/
 * `workflows` tables. Run this against any environment with real data in
 * those JSON columns before the column-drop migration
 * (2026_09_17_000002_drop_legacy_capability_columns_from_practices_table)
 * is allowed to run there.
 */
class BackfillPracticeCapabilities extends Command
{
    protected $signature = 'practices:backfill-capabilities';

    protected $description = 'Backfill practices.key_capabilities/workflow_steps JSON columns into the capabilities/workflows tables';

    public function handle(): int
    {
        Practice::query()->chunkById(50, function ($practices): void {
            foreach ($practices as $practice) {
                foreach ((array) ($practice->getRawOriginal('key_capabilities') ? json_decode($practice->getRawOriginal('key_capabilities'), true) : []) as $index => $cap) {
                    Capability::firstOrCreate(
                        ['practice_id' => $practice->id, 'title' => $cap['title']],
                        ['description' => $cap['description'] ?? null, 'sort_order' => $index],
                    );
                }

                foreach ((array) ($practice->getRawOriginal('workflow_steps') ? json_decode($practice->getRawOriginal('workflow_steps'), true) : []) as $index => $step) {
                    Workflow::firstOrCreate(
                        ['practice_id' => $practice->id, 'step' => $step['step'], 'title' => $step['title']],
                        ['description' => $step['description'] ?? null, 'sort_order' => $index],
                    );
                }

                $this->info("Backfilled {$practice->slug}");
            }
        });

        return self::SUCCESS;
    }
}
