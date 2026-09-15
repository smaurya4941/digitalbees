<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Explicit persona-routing signal (blueprint §8.3: "route by Practice tag
 * first, then Region"). Kept as real columns rather than derived from
 * `source_page_id` — a lead can carry a persona selection independent of
 * which page it was submitted from (e.g. the homepage's generic contact
 * form), and a page can itself be about two entities (a combinatorial
 * page), which makes "the page's entity" ambiguous as a routing key.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('leads', function (Blueprint $table): void {
            $table->unsignedBigInteger('practice_id')->nullable()->after('source_page_id');
            $table->unsignedBigInteger('region_id')->nullable()->after('practice_id');
            $table->index(['practice_id', 'region_id']);
        });
    }

    public function down(): void
    {
        Schema::table('leads', function (Blueprint $table): void {
            $table->dropIndex(['practice_id', 'region_id']);
            $table->dropColumn(['practice_id', 'region_id']);
        });
    }
};
