<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * A simple folder label for organising the media library ("Brand", "Blog",
 * "Team", …). Flat, not nested — enough to keep a growing library navigable.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('assets', function (Blueprint $table): void {
            $table->string('folder', 100)->nullable()->index()->after('alt_text');
        });
    }

    public function down(): void
    {
        Schema::table('assets', function (Blueprint $table): void {
            $table->dropColumn('folder');
        });
    }
};
