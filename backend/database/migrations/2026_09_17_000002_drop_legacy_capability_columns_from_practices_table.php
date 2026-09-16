<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Deploy-gated: only run this against an environment after
 * `php artisan practices:backfill-capabilities` (or a fresh seed) has
 * populated the new `capabilities`/`workflows` tables — this drops the
 * legacy JSON columns those commands read from. Safe to run immediately in
 * local/dev/CI where the seeder is the source of truth.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('practices', function (Blueprint $table): void {
            $table->dropColumn(['key_capabilities', 'workflow_steps']);
        });
    }

    public function down(): void
    {
        Schema::table('practices', function (Blueprint $table): void {
            $table->json('key_capabilities')->nullable()->after('key_stats');
            $table->json('workflow_steps')->nullable()->after('key_capabilities');
        });
    }
};
