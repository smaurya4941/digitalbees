<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * `content_reviews` was built for periodic content audits (`cycle` = weekly /
 * monthly / …). P2-2 reuses it as the review/approval trail: each workflow
 * transition that a person performs on a piece of content writes a row here.
 *
 * `cycle` becomes nullable (audit rows still set it; workflow rows don't) and
 * gains `action` + `from_state` / `to_state`.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('content_reviews', function (Blueprint $table): void {
            $table->string('cycle', 20)->nullable()->change();
            // System-performed transitions (the scheduled-publish command) have no reviewer.
            $table->unsignedBigInteger('reviewer_id')->nullable()->change();
            $table->string('action', 30)->nullable()->after('cycle');
            $table->string('from_state', 20)->nullable()->after('action');
            $table->string('to_state', 20)->nullable()->after('from_state');
        });
    }

    public function down(): void
    {
        Schema::table('content_reviews', function (Blueprint $table): void {
            $table->dropColumn(['action', 'from_state', 'to_state']);
            $table->string('cycle', 20)->nullable(false)->change();
            $table->unsignedBigInteger('reviewer_id')->nullable(false)->change();
        });
    }
};
