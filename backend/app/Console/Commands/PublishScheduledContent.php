<?php

namespace App\Console\Commands;

use App\Support\Content\ContentType;
use App\Support\Enums\WorkflowState;
use App\Support\Workflow\WorkflowStateMachine;
use App\Support\Workflow\WorkflowTransitionException;
use Illuminate\Console\Command;
use Illuminate\Database\Eloquent\Model;

/**
 * Publishes content whose scheduled time has arrived (P2-3). Runs every minute
 * from the scheduler (see routes/console.php); needs the system cron entry
 * `php artisan schedule:run` to be installed.
 */
class PublishScheduledContent extends Command
{
    protected $signature = 'content:publish-scheduled';

    protected $description = 'Publish content whose scheduled publish time has passed';

    public function handle(WorkflowStateMachine $machine): int
    {
        $published = 0;

        foreach (ContentType::keys() as $type) {
            $model = ContentType::modelClass($type);

            $model::query()->scheduledDue()->get()->each(function (Model $entity) use ($machine, $type, &$published): void {
                try {
                    // null actor = system: no permission checks, still audited + revalidated.
                    $machine->transition($entity, WorkflowState::Published, null);
                    $published++;
                    $this->info("Published {$type}/{$entity->slug}");
                } catch (WorkflowTransitionException $e) {
                    $this->warn("Skipped {$type}/{$entity->slug}: {$e->getMessage()}");
                }
            });
        }

        $this->info($published === 0 ? 'Nothing due.' : "Published {$published} item(s).");

        return self::SUCCESS;
    }
}
