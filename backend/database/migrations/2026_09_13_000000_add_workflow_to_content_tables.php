<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * The editorial workflow layer (P2-2).
 *
 * `workflow_state` sits alongside the existing `status` column: `status` stays
 * the public-visibility flag, `workflow_state` tracks review / approval /
 * scheduling. It is backfilled from `status` so nothing changes visibility on
 * deploy. `scheduled_for` drives {@see App\Console\Commands\PublishScheduledContent}.
 */
return new class extends Migration
{
    /** Tables whose `status` uses draft / published / archived. */
    private const CONTENT_TABLES = [
        'practices',
        'industries',
        'regions',
        'technologies',
        'case_studies',
        'resources',
        'locations',
    ];

    public function up(): void
    {
        foreach ([...self::CONTENT_TABLES, 'job_postings'] as $table) {
            Schema::table($table, function (Blueprint $t): void {
                $t->string('workflow_state', 20)->default('draft')->after('status')->index();
                $t->timestamp('scheduled_for')->nullable()->after('workflow_state');
            });
        }

        // Backfill from the current public status so nothing changes on deploy.
        foreach (self::CONTENT_TABLES as $table) {
            DB::table($table)->where('status', 'published')->update(['workflow_state' => 'published']);
            DB::table($table)->where('status', 'archived')->update(['workflow_state' => 'archived']);
            DB::table($table)->where('status', 'draft')->update(['workflow_state' => 'draft']);
        }

        // job_postings has its own status vocabulary (draft / open / closed).
        DB::table('job_postings')->where('status', 'open')->update(['workflow_state' => 'published']);
        DB::table('job_postings')->where('status', 'closed')->update(['workflow_state' => 'archived']);
        DB::table('job_postings')->where('status', 'draft')->update(['workflow_state' => 'draft']);
    }

    public function down(): void
    {
        foreach ([...self::CONTENT_TABLES, 'job_postings'] as $table) {
            Schema::table($table, function (Blueprint $t): void {
                $t->dropColumn(['workflow_state', 'scheduled_for']);
            });
        }
    }
};
