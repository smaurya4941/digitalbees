<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Sub-service pages (blueprint §22.3) need a "what's included" list distinct
 * from the free-text `body` — a small structured list of {title, description}
 * items rendered as its own section, per the blueprint's AI Agents example
 * (§22.4): "Use-case discovery & feasibility scoping · Agent architecture &
 * orchestration design · ...".
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('sub_services', function (Blueprint $table): void {
            $table->json('whats_included')->nullable()->after('body');
        });
    }

    public function down(): void
    {
        Schema::table('sub_services', function (Blueprint $table): void {
            $table->dropColumn('whats_included');
        });
    }
};
